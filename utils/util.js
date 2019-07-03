const floar = function (number){
  return Math.floor(number * 100) / 100;
}

/**
 * 将状态转成字符
 */
const formatStatus = function(status){
  let statusString = '';
  switch (status) {
    case 1:
      statusString = '待支付';
      break;
    case 2:
      statusString = '待发货';
      break;
    case 3:
      statusString = '待支付';
      break;
    case 4:
      statusString = '待发货';
      break;
    case 5:
      statusString = '配送中';
      break;
    case 6:
      statusString = '退款中';
      break;
    case 7:
      statusString = '已完成';
      break;
  }

  return statusString;
}

module.exports = {
  floar, formatStatus
}
