import {
  FaceAttrMapper,
  ChengGuansMapper,
  FaceAttrHat,
  FaceAttrExpressionMapper,
  FaceAttrSkincolorMapper,
} from '../utils/const';

const bodyAttrMapper = {
  Sex: '性别',
  National: '民族',
  Age: '年龄',
};
const bodyAttrArray = Object.keys(bodyAttrMapper);

function fixedDec(val) {
  return Math.floor(val * 100) / 100;
}

export const formatTagLabel = ({
  persons = [],
  vehicles = [],
  nonvehicles = [],
  chengguans = [],
}) => {
  const rects = [];
  if (persons) {
    persons.forEach((v) => {
      // 人脸
      // 性别、民族、年龄、肤色、人脸朝向、是否戴眼镜、是否戴帽子、是否系安全带、是否戴安全帽、是否戴口罩、面部表情
      if (v.face) {
        const { left, top, width, height } = v.face.rect;
        const faceAttrObject = v.face.attr;

        let sex;

        if (faceAttrObject.female) {
          sex = '女';
        }
        if (faceAttrObject.male) {
          sex = '男';
        }

        const poseRes = [];

        Object.keys(faceAttrObject.pose).forEach((i) => {
          poseRes.push(`${i}:${faceAttrObject.pose[i]}`);
        });

        const info = [
          { label: '性别', value: sex },
          { label: '民族', value: '汉族' },
          {
            label: '肤色',
            value: FaceAttrSkincolorMapper[faceAttrObject.skincolor],
          },
          { label: '人脸朝向', value: poseRes },
          { label: '戴眼镜', value: faceAttrObject.eyeglass ? '是' : '否' },
          { label: '戴帽子', value: FaceAttrHat[faceAttrObject.hat] },
          // { label: '戴安全帽', value: '' },
          { label: '戴口罩', value: faceAttrObject.facemask ? '是' : '否' },
          {
            label: '面部表情',
            value: FaceAttrExpressionMapper[faceAttrObject.faceexpression],
          },
        ];

        rects.push({
          type: 'face',
          value: `${left},${top},${width},${height}`,
          feature: v.face.faceFeature,
          attr: v.face.attr,
          confidence: fixedDec(v.face.confidence),
          info,
        });
      }

      if (v.body) {
        const { left, top, width, height } = v.body.rect;
        const info = [];
        const attrObject = v.body.attr;

        Object.keys(attrObject).forEach((i) => {
          if (bodyAttrArray.indexOf(i) !== -1) {
            info.push({
              label: bodyAttrMapper[i],
              value: attrObject[i].name || '-',
            });
          }
        });

        if (attrObject.Category) {
          attrObject.Category.forEach((k) => {
            info.push({
              label: k.categoryName,
              value: k.items[0] ? k.items[0].name : '-',
            });
          });
        }

        rects.push({
          type: 'body',
          value: `${left},${top},${width},${height}`,
          feature: v.body.faceFeature,
          attr: v.body.attr,
          confidence: fixedDec(v.body.confidence),
          info,
        });
      }
    });
  }

  if (vehicles) {
    vehicles.forEach((v) => {
      const { left, top, width, height } = v.rect;
      let info = [];

      if (v.passengers) {
        v.passengers.forEach((k) => {
          const passengersInfo = [
            { label: '驾驶员', value: k.driver ? '是' : '否' },
            { label: '打电话', value: k.phoneflag ? '是' : '否' },
            { label: '系安全带', value: k.beltflag ? '是' : '否' },
            { label: '遮挡面部', value: k.facecoverflag ? '是' : '否' },
          ];

          const passengersRect = k.rect;
          rects.push({
            type: 'vehiclesPassengers',
            value: `${passengersRect.left},${passengersRect.top},${passengersRect.width},${passengersRect.height}`,
            feature: k.feature,
            attr: k.attr,
            confidence: fixedDec(k.confidence),
            info: passengersInfo,
          });
        });
      }

      if (v.attr) {
        // 角度、类型、颜色、主品牌、子品牌、年款、标志物、特殊车辆、车后盖、车身破损、车顶物件

        const { modeltype, color, articles, others, symbols } = v.attr;

        let angleInfo;
        let colorInfo;
        let brandInfo;
        let subbrandInfo;
        let modelyearInfo;

        if (modeltype) {
          angleInfo = {
            label: '角度',
            value: modeltype.pose,
          };
          brandInfo = {
            label: '主品牌',
            value: modeltype.brand,
          };
          subbrandInfo = {
            label: '子品牌',
            value: modeltype.subbrand,
          };
          modelyearInfo = {
            label: '年款',
            value: modeltype.modelyear,
          };
        }

        if (color) {
          colorInfo = {
            label: '颜色',
            value: color.colorname,
          };
        }
        info = info.concat([
          angleInfo,
          colorInfo,
          brandInfo,
          subbrandInfo,
          modelyearInfo,
        ]);

        if (symbols) {
          const result = [];

          symbols.forEach((i) => {
            result.push(i.symbolname);
          });
          info.push({ label: '标志物', value: result.join(',') });
        }

        if (others) {
          others.forEach((i) => {
            info.push({ label: i.attributename, value: i.valuestring });
          });
        }

        if (articles) {
          articles.forEach((i) => {
            info.push({ label: i.articletypename, value: i.valuestring });
          });
        }
      }

      //  车牌类型、车牌颜色、车牌号码、车牌遮挡
      if (v.plates) {
        v.plates.forEach((k) => {
          const platesInfo = [];
          if (k.stylename) {
            const plateType = { label: '车牌类型', value: k.stylename };
            info.push(plateType);
            platesInfo.push(plateType);
          }

          if (k.color) {
            const plateColor = { label: '车牌颜色', value: k.color.colorname };
            info.push(plateColor);
            platesInfo.push(plateColor);
          }

          if (k.platetext) {
            const plateNumber = { label: '车牌号码', value: k.platetext };
            info.push(plateNumber);
            platesInfo.push(plateNumber);
          }

          rects.push({
            type: 'plate',
            value: `${k.rect.left},${k.rect.top},${k.rect.width},${k.rect.height}`,
            confidence: fixedDec(k.confidence),
            info: platesInfo,
          });
        });
      }

      rects.push({
        type: 'vehicle',
        value: `${left},${top},${width},${height}`,
        feature: v.feature,
        attr: v.attr,
        confidence: fixedDec(v.confidence),
        info,
      });
    });
  }

  if (nonvehicles) {
    nonvehicles.forEach((v) => {
      const { left, top, width, height } = v.rect;

      const info = [];
      if (v.attr) {
        v.attr.forEach((k) => {
          info.push({ label: k.attributename, value: k.valuestring });
        });
      }

      if (v.passengers) {
        v.passengers.forEach((k) => {
          const passengersRect = k.rect;
          const passengersInfo = [
            { label: '驾驶员', value: k.driver ? '是' : '否' },
            { label: '打电话', value: k.phoneflag ? '是' : '否' },
            { label: '系安全带', value: k.beltflag ? '是' : '否' },
            { label: '遮挡面部', value: k.facecoverflag ? '是' : '否' },
          ];
          if (k.attributes) {
            k.attributes.forEach((j) => {
              if (j.attributeid === 9) {
                passengersInfo.push({
                  label: `${j.attributename}`,
                  value: j.valuestring,
                });
              }
            });
          }

          rects.push({
            type: 'nonvehiclesPassengers',
            value: `${passengersRect.left},${passengersRect.top},${passengersRect.width},${passengersRect.height}`,
            feature: v.feature,
            attr: v.attr,
            confidence: fixedDec(k.confidence),
            info: passengersInfo,
          });
        });
      }

      rects.push({
        type: 'nonVehicle',
        value: `${left},${top},${width},${height}`,
        feature: v.feature,
        attr: v.attr,
        info,
        confidence: fixedDec(v.confidence),
      });
    });
  }

  if (chengguans) {
    chengguans.forEach((v) => {
      const { left, top, width, height } = v.rect;
      const info = [{ label: '类型', value: ChengGuansMapper[v.type] }];

      rects.push({
        type: 'chengguans',
        value: `${left},${top},${width},${height}`,
        chenggaunsType: v.type,
        info,
        confidence: fixedDec(v.confidence),
      });
    });
  }

  return rects;
};
