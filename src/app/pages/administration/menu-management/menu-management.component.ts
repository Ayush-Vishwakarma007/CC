import {Component, OnInit, TemplateRef} from '@angular/core';
import {ITreeOptions, ITreeState, KEYS, TREE_ACTIONS, IActionMapping} from "@circlon/angular-tree-component";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {v4} from 'uuid';
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import index from "@angular/pwa/pwa";
// import {element} from "protractor";
import {pagination} from "../../../pagination";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as $ from "jquery";
import Swal from "sweetalert2";

@Component({
  selector: 'app-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.scss']
})
export class MenuManagementComponent implements OnInit {
  modalRef: BsModalRef;
  menuDetail: any = [];
  chapterList: any = [];
  pageList: any = [];
  type: boolean;
  currentMenu:any= [];
  menuForm: FormGroup;
  isSubmit: boolean = false;

  options1: ITreeOptions = {
    nodeHeight: 23,
    dropSlotHeight: 6,
    allowDragoverStyling: true,
    animateExpand: true,
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        },
        drop: (tree, node, $event, {from, to}) => {
          let data = {
            "currentMenuStatus": from.data.currentMenuStatus,
            "menuItemId": from.data.data,
            "menuId": this.currentMenu['id'],
            "nextMenuStatus": "ENABLE",
            "position": to.index
          }
          if (to.parent.data.data != undefined) {
            data['newMenuParentId'] = to.parent.data.data;
          }
          this.spinner.show();
          let request = {
            path: 'uiPermission/subMenu/updatePosition',
            data: data,
            isAuth: true,
          };
          this.apiService.post(request).subscribe(response => {
            if (response['status']['code'] == 'OK') {
              this.getMenuList(this.type);
              this.toastrService.success(response['status']['description']);
              this.spinner.hide();
            } else {
              this.toastrService.error(response['status']['description']);
              this.spinner.hide();
            }

          });
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          node.expandAll();
        }
      },
    },
    allowDrag: (node) => node,
    allowDrop: (element, {parent, index}) => {
      if (parent.level < 2) {
        return true
      }
    }

  };
  options2: ITreeOptions = {
    nodeHeight: 23,
    dropSlotHeight: 23,
    allowDragoverStyling: true,
    animateExpand: true,
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        },
        drop: (tree, node, $event, {from, to}) => {
          let data = {
            "currentMenuStatus": from.data.currentMenuStatus,
            "menuItemId": from.data.data,
            "menuId": this.currentMenu['id'],
            "nextMenuStatus": "DISABLE",
            "position": to.index
          }
          if (to.parent.data.data != undefined) {
            data['newMenuParentId'] = to.parent.data.data;
          }
          this.spinner.show();
          let request = {
            path: 'uiPermission/subMenu/updatePosition',
            data: data,
            isAuth: true,
          };
          this.apiService.post(request).subscribe(response => {
            if (response['status']['code'] == 'OK') {
              this.getMenuList(this.type);
              this.toastrService.success(response['status']['description']);
              this.spinner.hide();
            } else {
              this.toastrService.error(response['status']['description']);
              this.spinner.hide();
            }

          });
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          node.expandAll();
        }
      },
    },
    allowDrag: (node) => node,
    allowDrop: (element, {parent, index}) => {
      if (parent.level < 2) {
        return true
      }
    }

  };
  state1: ITreeState = {
    expandedNodeIds: {},
    hiddenNodeIds: {},
    activeNodeIds: {},
  };
  state2: ITreeState = {
    expandedNodeIds: {},
    hiddenNodeIds: {},
    activeNodeIds: {},
  };
  pageId = '';
  nodes1 = [];
  nodes2 = [];
  details: any = [];
  new: any = {};
  editMenu: boolean = false;

  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.new['menuItem'] = {};
    this.menuForm = this.formBuilder.group({
      pageId: ['', Validators.required],
      name: ['', Validators.required],
      class: [''],
    });
  }

  ngOnInit() {
    this.getMenuList(true);
    this.getPageList();
  }

  getChapterList() {
    this.spinner.show();
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.chapterList = response['data'];
        this.spinner.hide();
      } else {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });
  }

  getMenuList(value) {
    let formData = {
      allowChange: value
    };

    let data = {
      path: "uiPermission/menu/getAll/",
      data: formData,
      isAuth: true
    };
    this.type = value;

    this.apiService.post(data).subscribe(response => {
      this.menuDetail = response['data'];
      console.log(this.menuDetail)
      this.currentMenu = this.menuDetail[0];
      this.setMenu();
    });

  }

  getMenuDetail(data) {
    
    this.details = data.detail;
    this.editMenu = true;

   let index = this.pageList['content'].findIndex(x => x.id == this.details['pageId']);
    this.pageId = index;
    this.new['menuStatus']= data.currentMenuStatus;
    this.new['menuId'] = this.currentMenu['id'];
    this.new['menuItem']['name'] = this.details['name'];
    this.new['menuItem']['iconClass'] = this.details['iconClass'];
    this.new['menuItem']['link'] = this.details['link'];
    this.menuForm.patchValue({
      name: this.details['name'],
      pageId: this.pageId,
      class: this.details['iconClass']
    });
  }
  setMenu()
  {
    let menus = [];
    let menus1 = [];
    let i = 1;

    this.currentMenu['menuItems'].map((item) => {
      let child = [];
      item.menuItems.map((menu) => {
        child.push({name: menu.name, data: menu.id, drag: false, detail: menu, currentMenuStatus: 'ENABLE'});
      });
      let data = {
        data: item.id,
        drag: true,
        currentMenuStatus: 'ENABLE',
        name: item.name,
        detail: item,
        children: child
      };
      menus.push(data);
      i++;
    });
    if (this.currentMenu['disabledMenuItems']) {
      this.currentMenu['disabledMenuItems'].map((item) => {
        let child = [];
        item.menuItems.map((menu) => {
          child.push({name: menu.name, data: menu.id, detail: menu, drag: false, currentMenuStatus: 'DISABLE'});
        });
        let data = {
          _id: i,
          drag: true,
          data: item.id,
          currentMenuStatus: 'DISABLE',
          name: item.name,
          detail: item,
          children: child
        };
        menus1.push(data);
        i++;
      });
    }
    this.nodes1 = menus;
    this.nodes2 = menus1;
  }
  addMenu() {
    this.isSubmit = true;
    if (this.editMenu == false) {
     // this.details = this.menuDetail[this.pageId];
    }
    if(this.menuForm.valid){
      this.new["menuId"] = this.currentMenu['id'];
    if (this.editMenu == false) {
      this.new["menuStatus"] = "ENABLE";
      this.new["position"] = -1;
      delete this.new["subMenuId"];
    } else {
      this.new["subMenuId"] = this.details['id'];
    }
    this.pageId = this.menuForm.value.pageId;
    this.new['menuItem']['name'] = this.menuForm.value.name;
    this.new['menuItem']['iconClass'] = this.menuForm.value.class;
    this.new['menuItem']['permissions'] = null;
    this.new['menuItem']['iconClassActive'] = null;
    this.spinner.show();
    let data = {};
    if (this.editMenu == false) {
      data = {
        path: 'uiPermission/submenu/add',
        data: this.new,
        isAuth: true,
      };
    } else {
      data = {
        path: 'uiPermission/subMenu/update',
        data: this.new,
        isAuth: true,
      };
    }
    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'OK' || response['status']['code'] == 'CREATED') {
        this.toastrService.success(response['status']['description']);
        this.getMenuList(this.type);
        this.menuForm.reset();
        this.isSubmit = false;
        this.modalRef.hide();
        this.spinner.hide();
      } else {
        this.isSubmit = false;
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });
    }
    else{
      this.toastrService.error('Please fill all required fields!');
    }
  }

  deleteMenu() {
    let data = {};
    data["subMenuId"] = this.details['id'];
    data["menuId"] = this.currentMenu['id'];
    if (this.type == true) {
      data["menuStatus"] = "ENABLE";
    } else {
      data["menuStatus"] = "DISABLE";
    }
    $("#delete_btn").click();
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this menu!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path:'uiPermission/subMenu/'+data['menuId']+'/'+data["subMenuId"]+'?menuStatus='+ data["menuStatus"],
          isAuth: true,
        }
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Success!',
              //response['status']['description'],
              'Menu has been deleted.',
              'success'
            );
            this.getMenuList(this.type);
          } else {
            Swal.fire(
              'Cancelled',
              'Menu is safe.',
              'error'
            );
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Menu is safe.',
          'error'
        )
      }
    })
  }

  // deleteMenu() {
  //   let data = {};
  //   data["subMenuId"] = this.details['id'];
  //   data["menuId"] = this.currentMenu['id'];
  //   if (this.type == true) {
  //     data["menuStatus"] = "ENABLE";
  //   } else {
  //     data["menuStatus"] = "DISABLE";
  //   }
  //   let formData = {
  //     path: 'uiPermission/subMenu/'+data['menuId']+'/'+data["subMenuId"]+'?menuStatus='+ data["menuStatus"],
  //     data: data,
  //     isAuth: true,
  //   };
  //
  //   this.apiService.get(formData).subscribe(response => {
  //     if (response['status']['code'] == 'OK') {
  //       this.toastrService.success(response['status']['description']);
  //       this.spinner.hide();
  //       this.getMenuList(this.type);
  //       this.modalRef.hide();
  //     } else {
  //       this.toastrService.error(response['status']['description']);
  //       this.spinner.hide();
  //     }
  //   });
  // }

  changePage(index) {
    this.new['menuId'] = this.details['id'];
    this.new['menuItem']['pageId'] = this.pageList['content'][index]['id'];
    this.new['menuItem']['name'] = this.pageList['content'][index]['name'];
    this.new['menuItem']['iconClass'] = '';
    this.new['menuItem']['link'] = this.pageList['content'][index]['path'];

  }

  getPageList() {
    let reqData = {
      "filter": {
        "search": "",
      },
      "page": {
        "pageLimit": 50,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "NAME"
      }
    };
    this.spinner.show();
    let request = {
      path: 'uiPermission/uiPage/getAll',
      data: reqData,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.pageList = response['data'];
       
        this.spinner.hide();
      } else {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });
  }

  changeMenuType(list)
  {
      this.currentMenu = list;
      this.setMenu();
  }

  formReset(){
    this.isSubmit = false;
    this.menuForm.reset();
  }

  openModalWithClass2(template1: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template1,
      Object.assign({}, { class: 'modal-lg modal-dialog-centered popop-common-center addmenu-popup' })
    );
  }
}
