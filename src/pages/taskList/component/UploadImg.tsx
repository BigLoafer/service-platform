import { Icon, message, Upload } from 'antd';
import { post } from 'app/fetch';
import { If, Svg } from 'app/ui';
import { toJS } from 'mobx';
import React from 'react';
import styles from './UploadImg.scss';

export interface UploadImgProps {
  value?: string[];
  onChange?: any;
  // 允许上传的图片格式
  format?: string[];
  // 允许上传的最大size
  size?: string | number;
  // 允许上传你的图片最大数量
  maxCount?: number;
  // 图片行上方的文字提示
  topTip?: string;
}
export default class UploadImg extends React.Component<UploadImgProps> {
  constructor(props: any) {
    super(props);
  }
  render() {
    let { maxCount } = this.props;
    const { value, topTip } = this.props;
    if (!maxCount) {
      maxCount = 5;
    }
    let imgs: any = value;
    const imgsFormat: any = [];
    if (!(imgs instanceof Array)) {
      imgs = [imgs];
    }

    imgs.map((item: any) => {
      if (
        item &&
        (item.indexOf('http://') === 0 || item.indexOf('https://') === 0)
      ) {
        imgsFormat.push(item);
      }
    });
    return (
      <div>
        <If data={topTip}>
          <div className={styles.topTip}>{topTip}</div>
        </If>
        <div>
          {imgsFormat.map((item: string, index: any) => {
            return (
              <div key={item} className={styles.img}>
                <img src={item} width="100%" height="100%"/>
                <div className={styles.imgDelete}>
                  <div
                    className={styles.delSvgCta}
                    onClick={() => {
                      this.deleteImg(index);
                    }}
                  >
                    <Icon type="delete" />
                  </div>
                </div>
              </div>
            );
          })}
          <If data={imgsFormat.length < maxCount}>
            <div className={styles.uploadCta}>
              <Upload
                showUploadList={false}
                beforeUpload={(file, fileList) => {
                  this.uploadImg(file);
                  return false;
                }}
              >
                <div className={styles.uploadImgIcon}>
                  <Icon type="plus" />
                </div>
              </Upload>
            </div>
          </If>
        </div>
      </div>
    );
  }
  uploadImg = async (file: any, index?: any) => {
    let { format } = this.props;
    const { size } = this.props;
    if (!format) {
      format = ['png', 'jpg', 'jpeg'];
      let myType = file.name.split('.');
      const myTypeLen = myType.length;
      myType = myType[myTypeLen - 1];

      if (format) {
        // const len = format.length;
        let isForm = false;

        format.map((item: any) => {
          const type = item.toLowerCase();
          if (type === myType) {
            isForm = true;
          }
        });
        // for (let i: number = 0; i < len; i++) {
        //   const type = format[i].toLowerCase();
        //   if (type === myType) {
        //     isForm = true;
        //     break;
        //   }
        // }
        if (!isForm) {
          message.error(`只能上传${format.toString()}式的图片`);
          return;
        }
      }
    }
    if (size) {
      if (file.size > size) {
        message.error(`图片大小不能超过${size}k`);
        return;
      }
    }
    try {
      const json: any = await post(
        '/webapi/misun/web/file/1.0/?service=File.uploadPicture',
        {
          file
        },
        2
      ).then(res => res);

      const { data } = json;
      let { value } = this.props;
      value = toJS(value);
      let imgs: any = value ? value : [];
      if (index === undefined) {
        if (imgs.push) {
          imgs.push(data.url);
        } else {
          imgs = data.url;
        }
      } else {
        imgs = imgs.splice(index, 1, data.url);
      }
      this.props.onChange(imgs);
      message.success('图片上传成功');
    } catch (error) {
      message.error('图片上传失败');
    }
  };
  deleteImg = (index: any) => {
    let { value }: any = this.props;

    if (value.splice) {
      value.splice(index, 1);
    } else {
      value = '';
    }

    this.props.onChange(value);
  };
}
