import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { SpinnerService } from "../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { SeoService } from "../../../services/seo.service";
// import { EmbedVideoService } from "ngx-embed-video";
import { Observable, Subject } from "rxjs";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { startWith } from "rxjs/internal/operators/startWith";
import { map } from "rxjs/operators";
import * as $ from "jquery";
import Swal from "sweetalert2";
import {GalleryImagePipePipe} from '../../../pipes/gallery-image-pipe.pipe'
@Component({
  selector: 'app-event-gallery',
  templateUrl: './event-gallery.component.html',
  styleUrls: ['./event-gallery.component.scss'],
  providers:[GalleryImagePipePipe],
})
export class EventGalleryComponent implements OnInit {
  modalRef: BsModalRef;

  chapterDetail: any = [];
  chapterIds: any = [];
  chapterEventList: any = [];
  eventId = "";
  galleryList: any = [];
  galleryType: any = [];
  galleryCategory: any = [];
  galleryForm: FormGroup;
  mediaUploadUrl = "gallery/file/upload/file";
  imageList: any = [];
  videoList: any = [];
  uploadedImageList: any = [];
  uploadedVideoList: any = [];
  totalAlbum: any;
  validTypesImage = ["jpeg", "jpg", "png"];
  validTypesVideo = ["mp4", "MP4"];
  maxFileSize: any;
  isSubmit: boolean = false;
  isLinkShow: boolean = false;
  isChannelUrlShow: boolean = true;
  youTubeUrls: any = [];
  galleryId = "";
  galleryDetailForEdit: any = [];
  deletedIds: any = [];
  externalLink = "";
  galleryLocation = "HOME";
  eventDetail: any = [];
  eventSubject: Subject<any> = new Subject();
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  showUploaders:boolean=false
  backgroundImage:any
  constructor(public pipe:GalleryImagePipePipe,public spinner: SpinnerService, private modalService: BsModalService, public formBuilder: FormBuilder, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService, /*private embedService: EmbedVideoService*/) {

    this.galleryForm = this.formBuilder.group({
      name: ["", Validators.required],
      categoryName: ["", Validators.required],
      chapterId: ["", Validators.required],
      dateTime: [""],
      galleryType: ["", Validators.required],
      eventId: [""],
    });
  }

  async ngOnInit() {
    await this.getChapters();
    this.getGalleryCategory();
    this.getGalleryType();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  getChapters() {
    let request = {
      path: "community/chapters/access",
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe((response) => {
        this.chapterDetail = response["data"];
        this.chapterDetail.forEach((item) => {
          this.chapterIds.push(item.id);
        });
        this.getGalleryDetail(this.chapterDetail[0]["id"]);

        resolve(null);
      });
    });
  }

  getChapterEvent() {
    let data = {
      chapterIds: this.chapterIds,
    };

    let request = {
      path: "event/filter/chapter/events",
      data: data,
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.post(request).subscribe((response) => {
        this.chapterEventList = response["data"];
        if (this.chapterEventList[0]) {
        }
        resolve(null);
      });
    });
  }

  getGalleryDetail(id) {
    this.eventId = id;
    this.getAllGalleriesList();
  }

  getAllGalleriesList() {
    let data = {
      filter: {
        chapterId: this.eventId,
        mediaLimit: 1,
      },
      page: {
        pageLimit: 50,
        pageNumber: 0,
      },
      sort: {
        orderBy: "ASC",
        sortBy: "EVENT_NAME",
      },
    };

    let request = {
      path: "gallery/galleries",
      data: data,
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.post(request).subscribe((response) => {
        this.galleryList = response["data"];
        this.totalAlbum = response["data"]["totalElements"];
        console.log(this.galleryList);
        resolve(null);
      });
    });
  }

  getGalleryType() {
    let request = {
      path: "gallery/galleryType",
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.get(request).subscribe((response) => {
        this.galleryType = response["data"];
        resolve(null);
      });
    });
  }

  getGalleryCategory() {
    let request = {
      path: "gallery/galleryCategory/getAll",
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.get(request).subscribe((response) => {
        this.galleryCategory = response["data"];
        this.options = [];
        this.galleryCategory.forEach((item, index) => {
          this.options.push(item.name);
        });
        resolve(null);
      });
    });
  }

  galleryTypeChange(value) {
    if (value == "INTERNAL") {
      this.isLinkShow = false;

      this.isChannelUrlShow = true;
    } else {
      this.isLinkShow = true;

      this.isChannelUrlShow = false;
      if (this.uploadedImageList.length > 1) {
        let list = [];
        list.push(this.uploadedImageList[0]);
        this.uploadedImageList = list;
      }

    }
   
  }

  saveGallery() {
    this.isSubmit = true;
    console.log(this.galleryForm.value);
    this.galleryForm.patchValue({
      categoryName: this.myControl.value,
    });
    this.galleryForm.patchValue({
      chapterId: this.eventId,
    });

    if (this.galleryForm.valid) {
      let formData = this.galleryForm.value;
      console.log(formData["galleryType"], this.isLinkShow == false);
      if (formData["galleryType"] == "EXTERNAL") {
        if (this.imageList.length == 0 || this.externalLink == "") {
          if (this.imageList.length == 0 && this.isLinkShow == false) {
            this.toastrService.error("Please upload one image");
            console.log("1");
            return false;
          } else if (this.externalLink == "") {
            this.toastrService.error("External link is required");
            console.log("2");
            return false;
          }
        } else {
          console.log("3");
          let image = "";
          image = this.imageList[0]["responseData"]["data"]["url"];

          //formData['profileUrl'] = image
          formData["externalLink"] = this.externalLink;
        }
      }

      if (
        (this.imageList != null || this.imageList != "") &&
        formData["galleryType"] == "INTERNAL"
      ) {
        let docArray = [];
        docArray = this.imageList;
        let otherDoc = [];
        docArray.forEach((item, index) => {
          if (item["responseData"]["data"]["id"]) {
            otherDoc.push({
              id: item["responseData"]["data"]["id"],
              link: item["responseData"]["data"]["url"],
              thumbnailLink: item["responseData"]["data"]["thumbnailLink"],
            });
          } else {
            otherDoc.push({
              link: item["responseData"]["data"]["url"],
              thumbnailLink: item["responseData"]["data"]["thumbnailUrl"],
            });
          }
        });
        formData["imageUrls"] = otherDoc;
        // localStorage.setItem("imageList",JSON.stringify(this.imageList['data']['url']))
      }
      

      if (
        (this.videoList != null || this.videoList != "") &&
        formData["galleryType"] == "INTERNAL"
      ) {
        let videoArray = [];
        videoArray = this.videoList;
        let otherArray = [];
        videoArray.forEach((item, index) => {
          if (item["responseData"]["data"]["id"]) {
            otherArray.push({
              id: item["responseData"]["data"]["id"],
              link: item["responseData"]["data"]["url"],
            });
          } else {
            otherArray.push({ link: item["responseData"]["data"]["url"] });
          }
        });
        formData["videoUrls"] = otherArray;
      }

      if (this.youTubeUrls.length != 0) {
        let urls = [];
        urls = this.youTubeUrls;
        let otherUrl = [];
        urls.forEach((item, index) => {
          if (item["id"]) {
            otherUrl.push({ id: item["id"], link: item["link"] });
          } else {
            otherUrl.push({ link: item["link"] });
          }
        });

        formData["youtubeUrls"] = otherUrl;
      }

      if (this.deletedIds.length != 0) {
        formData["deletedIds"] = this.deletedIds;
      }
      formData["galleryLocation"] = this.galleryLocation;
      if (this.galleryLocation == "EVENT") {
        if (this.eventDetail.length == 0) {
          this.toastrService.error("Please Select Event");
          return false;
        } else {
          formData["eventId"] = this.eventDetail["id"];
        }
      } else {
        if (this.galleryForm.value.categoryName == "") {
          this.toastrService.error("Please Select Category");
          return false;
        }
        formData["eventId"] = null;
      }
      formData["externalLink"] = this.externalLink;
      let request = {};
      console.log(formData);

      if (this.galleryId != "") {
        request = {
          path: "gallery/gallery/update/" + this.galleryId,
          data: formData,
          isAuth: true,
        };
      } else {
        request = {
          path: "gallery/gallery/create",
          data: formData,
          isAuth: true,
        };
      }

      this.apiService.post(request).subscribe((response) => {
        if (
          response["status"]["code"] == "CREATED" ||
          response["status"]["code"] == "OK"
        ) {
          this.toastrService.success(response["status"]["description"]);
          this.isSubmit = false;
          this.galleryForm.reset();
          this.galleryId = "";
          this.uploadedImageList = [];
          this.uploadedVideoList = [];
          this.youTubeUrls = [];
          $("#closeButton").click();
          this.getAllGalleriesList();
          this.modalRef.hide();
        } else {
          this.isSubmit = false;
          this.toastrService.error(response["status"]["description"]);
        }
      });
    } else {
      this.toastrService.error("please fill all required fields");
    }
   
  }

  editGallery(id) {
    let request = {
      path: "gallery/gallery/detail/" + id,
      isAuth: true,
    };

    this.apiService.get(request).subscribe((response) => {
      this.galleryDetailForEdit = response["data"];

      this.fillEditGalleryDetail(this.galleryDetailForEdit);
      console.log(this.galleryDetailForEdit);
    });
  }

  fillEditGalleryDetail(list) {
    console.log(list);
    this.resetForm();
    this.galleryId = list.id;
    this.externalLink = list.externalLink;
    this.galleryForm.patchValue({
      name: list.name,
      categoryName: list.categoryName,
      dateTime: new Date(list.dateTime),
      // externalLink: list.externalLink,
      galleryType: list.galleryType,
      chapterId: list.chapterId,
    });
    this.myControl.patchValue(list.categoryName);
    this.galleryLocation = list.galleryLocation;
    if (this.galleryLocation == "EVENT") {
      this.getEventDetail(list.eventId);
    }
    if (list.galleryType == "INTERNAL") {
      this.isLinkShow = false;
      this.isChannelUrlShow = true;
    } else {
     
      this.isLinkShow = true;
      this.isChannelUrlShow = false;
      this.externalLink = list.externalLink;
    }

    if (list.youtubeList != null) {
      list.youtubeList.map((item) => {
        this.youTubeUrls.push({ link: item.link, id: item.id });
      });
    }

    if (list.imageList != null) {
      this.uploadedImageList = [];
      let arrayDoc = [];
      list.imageList.forEach((item, index) => {
        arrayDoc.push(item);
      });
      arrayDoc.forEach((item, index) => {
        this.imageList[index] = [];
        this.imageList[index]["responseData"] = [];
        this.imageList[index]["responseData"]["data"] = [];
        this.imageList[index]["responseData"]["data"]["url"] = item.link;
        this.imageList[index]["responseData"]["data"]["thumbnailLink"] =
          item.thumbnailLink;
        this.imageList[index]["responseData"]["data"]["id"] = item.id;
      });

      this.imageList.forEach((item, index) => {
        this.uploadedImageList.push({
          link: item["responseData"]["data"]["url"],
          thumbnailLink: item["responseData"]["data"]["thumbnailLink"],
          id: item["responseData"]["data"]["id"],
        });
        
      });
      this.uploadedImageList.forEach((item, index) => {
        this.backgroundImage = this.pipe.transform(item.link);
        console.log(this.backgroundImage)
        // if (item.link.indexOf(item.link) !== -1) {
        //   this.uploadedImageList[index]['link'] = this.backgroundImage;
        // } else {
        //   this.uploadedImageList[index]['link'] = item.link;
        // }
      });
    }

    if (list.videoList != null) {
      this.uploadedVideoList = [];
      let array = [];
      list.videoList.forEach((item, index) => {
        array.push(item);
      });

      array.forEach((item, index) => {
        this.videoList[index] = [];
        this.videoList[index]["responseData"] = [];
        this.videoList[index]["responseData"]["data"] = [];
        this.videoList[index]["responseData"]["data"]["url"] = item.link;
        this.videoList[index]["responseData"]["data"]["id"] = item.id;
      });

      this.videoList.forEach((item, index) => {
        this.uploadedVideoList.push({
          link: item["responseData"]["data"]["url"],
          id: item["responseData"]["data"]["id"],
        });
      });
    }
    $("#openEditModel").click();
  }
  clearEvent() {
    this.eventDetail = [];
  }
  deleteGallery(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this gallery!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "gallery/gallery/" + id,
          isAuth: true,
        };
        this.apiService.get(request).subscribe((response) => {
          if (response["status"]["code"] == "OK") {
            Swal.fire(
              "Success!",
              //response['status']['description'],
              "Gallery has been deleted.",
              "success"
            );
            this.getAllGalleriesList();
          } else {
            Swal.fire("Cancelled", "Gallery is safe.", "error");
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Gallery is safe.", "error");
      }
    });
  }

  addUrl() {
    this.youTubeUrls.push({ link: "" });
  }

  removeLastUrl(i, list) {
    this.youTubeUrls.splice(i, 1);
    if (list.id) {
      this.deletedIds.push(list.id);
    }
  }

  removeImage(index, list) {
    this.imageList.splice(index, 1);
    this.uploadedImageList.splice(index, 1);

    if (list.id) {
      this.deletedIds.push(list.id);
    } else {
      this.removeUploadMedia(list.link, list.thumbnailLink);
    }
  }

  removeVideo(index, list) {
    this.videoList.splice(index, 1);
    this.uploadedVideoList.splice(index, 1);

    if (list.id) {
      this.deletedIds.push(list.id);
    } else {
      this.removeUploadMedia(list.link, list.thumbnailLink);
    }
  }

  removeUploadMedia(link, thumbnailLink) {
    let data = {
      link: link,
      thumbnailLink: thumbnailLink,
    };

    let request = {
      path: "gallery/deleteMedia",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe((response) => {});
  }

  invalidUploadFile() {
    this.toastrService.error("Please upload only image file");
  }

  invalidVideoUploadFile() {
    this.toastrService.error("Please upload only video file");
  }

  maxFileError() {
    this.toastrService.error("Maximum 4 file is allowed");
  }

  max1FileError() {
    this.toastrService.error("Maximum 1 file is allowed");
  }

  fileSizeError() {
    let request = {
      path: "community/configuration/publicInfo",
      isAuth: true,
    };
    this.apiService.get(request).subscribe((response) => {
      this.maxFileSize = response["data"]["imageMaxSize"];
      this.toastrService.error(
        "Maximum " + response["data"]["imageMaxSize"] + "MB size is allowed"
      );
    });
    //this.toastrService.error('Maximum 4MB size allowed');
  }

  uploadStarted() {
    this.spinner.show();
  }

  queueCompleted() {}

  imageQueueCompleted() {
    let last = [];
    console.log(this.imageList);
    last.push(this.imageList[this.imageList.length - 1]);
    this.uploadedImageList = [];

    this.imageList.map((item, index) => {
      if (item["responseData"]["data"]["thumbnailUrl"]) {
        this.uploadedImageList.push({
          link: item["responseData"]["data"]["url"],
          thumbnailLink: item["responseData"]["data"]["thumbnailUrl"],
        });
      } else {
        this.uploadedImageList.push({
          link: item["responseData"]["data"]["url"],
          thumbnailLink: item["responseData"]["data"]["thumbnailLink"],
          id: item["responseData"]["data"]["id"],
        });
        this.backgroundImage = this.pipe.transform(item['responseData']['data']['url']);
        console.log(this.backgroundImage)
      
      
      }
    
    });
    this.spinner.hide();
  }

  videoQueueCompleted() {
    let last = [];
    last.push(this.videoList[this.videoList.length - 1]);

    last.map((item, index) => {
      this.uploadedVideoList.push({
        link: item["responseData"]["data"]["url"],
      });
    });
    this.spinner.hide();
  }

  uploadedFilesChange() {}
  resetForm() {
    this.isSubmit = false;
    this.imageList = [];
    this.galleryId = "";
    this.externalLink = "";
    this.videoList = [];
    this.uploadedImageList = [];
    this.uploadedVideoList = [];
    this.youTubeUrls = [];
    this.galleryForm.reset();
    this.eventDetail = [];
    this.galleryLocation = "HOME";
    this.myControl = new FormControl();
    this.isChannelUrlShow = true;
    this.isLinkShow = false;
  }

  openEventModal() {
    this.eventSubject.next(this.eventId);
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign(
        {},
        { class: "modal-lg add-media gallerycenter-popup galleryright-popup" }
      )
    );
  }

  openModalWithClass2(template2: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template2,
      Object.assign({}, { class: "modal-lg gallerypopup-redesign" })
    );
  }

  changeEvent() {
    console.log(this.eventDetail);
  }

  getEventDetail(id) {
    this.spinner.show();
    let request = {
      path: "event/details/" + id,
      isAuth: true,
    };
    this.apiService.get(request).subscribe((response) => {
      if (response["status"]["code"] == "OK") {
        this.eventDetail = response["data"];
      }
    });
    this.spinner.hide();
  }
}
