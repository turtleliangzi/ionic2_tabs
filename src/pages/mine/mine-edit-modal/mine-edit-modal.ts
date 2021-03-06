import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';

import {FormBuilder} from '@angular/forms';
import {NavParams, ViewController} from 'ionic-angular';
import {NativeService} from '../../../providers/NativeService';
import {UserInfo} from "../../../model/UserInfo";
import {Validators} from "../../../providers/Validators";

@Component({
  selector: 'page-mine-edit-modal',
  templateUrl: 'mine-edit-modal.html'
})
export class MineEditModalPage {
  userInfo: UserInfo;
  userForm: any;
  verifyMessages = {
    'name': {
      'errorMsg': '',
      'required': '用户名为必填项',
      'minlength': '姓名最少2个字符',
      'chinese': '姓名必须是中文'
    },
    'phone': {
      'errorMsg': '',
      'required': '手机号码为必填项',
      'phone': '请输入正确的手机号码'
    },
    'email': {
      'errorMsg': '',
      'required': '电子邮箱为必填项',
      'email': '请输入正确的邮箱地址'
    }
  };

  constructor(private params: NavParams,
              private viewCtrl: ViewController,
              private storage: Storage,
              private formBuilder: FormBuilder,
              private nativeService: NativeService) {
    this.userInfo = params.get('userInfo');
    this.userForm = this.formBuilder.group({
      name: [this.userInfo.name, [Validators.required, Validators.minLength(2), Validators.chinese]],
      phone: [this.userInfo.phone, [Validators.required, Validators.phone]],
      email: [this.userInfo.email, [Validators.required, Validators.email]]
    });
    this.userForm.valueChanges
      .subscribe(data => {
        const verifyMessages = this.verifyMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.userForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
      });
  }

  onSubmit() {
    Object.assign(this.userInfo, this.userForm.value);
    this.storage.set('UserInfo', this.userInfo);
    this.nativeService.showToast('保存成功');
    this.viewCtrl.dismiss(this.userInfo);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
