export const TIME_FORMAT_STRING = 'YYYY-MM-DD HH:mm:ss';

export const TIME_FORMAT_STRING_WITHOUT_SECONDS = 'YYYY-MM-DD HH:mm';

//
export const StreamTypeMapper = {
  0: '实时流',
  1: '录像流',
  // 2: '历史文件',
};

//
export const StructureTypeMapper = {
  0: '人脸人体',
  1: '车辆',
  2: '全目标',
  3: '城管',
};

export const StructureKeyMapper = {
  body: '人体',
  face: '人脸',
  vehicle: '车辆',
  nonVehicle: '非机动车',
  chengguans: '城管',
  vehiclesPassengers: '机动车乘客',
  nonvehiclesPassengers: '非机动车乘客',
  plate: '车牌',
};

/**  解码倍速，仅对录像流和历史文件有效 */
export const DecodeRateMapper = {
  1: '1倍速',
  2: '2倍速',
  4: '4倍速',
  8: '8倍速',
  16: '16倍速',
};

/**  解码模式 */
export const DecodeModeMapper = {
  0: 'I帧模式',
  1: '抽帧模式',
  2: '全帧模式',
};

/**  Status */
export const StatusMapper = {
  0: '准备',
  1: '进行中',
  2: '已完成',
  3: '任务删除',
  4: '暂停中',
  5: '等待中',
  '-1': '拉流失败',
  '-2': '解码失败',
  '-3': '推图失败',
};

// 车辆年检标，挂件等标识物信息，
export const VehiclesAttSymbolsMapper = {
  symbolname: '标志物名称',
};

// // 非机动车相关属性描述NONVEHICLE_ATTR
export const PassengerAttMapper = {
  attributename: '属性名称',
  valuestring: '描述',
  pose: '抓拍位置',
};

export const FaceAttrMapper = {
  // female: '女',
  // male: '男',
  nation: '汉',
  age: '年龄',
  pose: '人脸朝向信息',
  eyeglass: '戴眼镜',
  sunglass: '戴太阳眼镜',
  facemask: '面部是否有遮挡',
  hat: '帽子',
  skincolor: '肤色',
  faceexpression: '表情',
};

export const FaceAttrHat = {
  0: '未带帽子',
  1: '带帽子',
  2: '带头巾',
};

export const FaceAttrSkincolorMapper = {
  1: '黄色',
  2: '白色',
  3: '黑色',
  4: '棕色',
};

export const FaceAttrExpressionMapper = {
  0: '生气',
  1: '厌恶',
  2: '害怕',
  3: '高兴',
  4: '悲伤',
  5: '惊讶',
  6: '正常',
};

export const ChengGuansMapper = {
  0: '沿街小贩',
  1: '占道经营',
  2: '垃圾暴露',
  3: '占道广告牌',
  4: '沿街晾晒',
  5: '非机动乱停放',
  6: '撑伞经营',
  7: '垃圾袋乱堆',
  8: '垃圾桶满溢',
  9: '乱堆物料',
};

export const PassengerAttValueIdMapper = {
  1: '⾯部遮挡',
  2: '⻋顶⾯部遮挡',
  3: '⿊镜⾯部遮挡',
  4: '遮阳板⾯部遮挡',
  5: '其他',
};
