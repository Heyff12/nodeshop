var express = require('express');
var router = express.Router();
require('./../util/util')

var User = require('./../model/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/test', function(req, res, next) {
  res.send('respond with a resource333');
});
//登陆
router.post('/login', function(req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd,
  }
  User.findOne(param, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        //req.session.user = doc;
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        });
      } else {
        res.json({
          status: '1',
          msg: '账号密码错误',
          result: ''
        });
      }
    }
  });
});
//登出
router.post('/logout', function(req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: '',
    result: {}
  });
});
//通过cookie判断登陆
router.get('/checkLogin', function(req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: {
        userName: req.cookies.userName
      }
    });
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});
//查询用户的购物车数据
router.get('/cartList', function(req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({ userId: userId }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        });
      }

    }
  });
});
//购物车数据删除
router.post('/cartDel', function(req, res, next) {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  User.update({ 'userId': userId }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      });
    }
  });
});
//购物车数据--修改
router.post('/cartEdit', function(req, res, next) {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var productNum = req.body.productNum;
  var checked = req.body.checked;
  User.update({ 'userId': userId, 'cartList.productId': productId }, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked
  }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      });
    }
  });
});
//全选
router.post('/editCheckAll', function(req, res, next) {
  var userId = req.cookies.userId;
  var checkAll = req.body.checkAll ? '1' : '0';
  User.findOne({ userId: userId }, function(err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAll
        });
        user.save(function(err1, doc) {
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'success'
            });
          }
        })
      }

    }
  });
});
//查询用户地址
router.get('/addressList', function(req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({ userId: userId }, function(err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: user.addressList
      });
    }
  });
});
//设置默认地址
router.post('/setDefault', function(req, res, next) {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'addressId is null',
      result: ''
    });
  }
  User.findOne({ userId: userId }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var addressList = doc.addressList;
      addressList.forEach((item) => {
        if (item.addressId == addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      });
      doc.save(function(err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          });
        } else {
          res.json({
            status: '0',
            msg: '',
            result: ''
          });
        }
      });

    }
  });
});
//删除地址
router.post('/delAddr', function(req, res, next) {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'addressId is null',
      result: ''
    });
  }
  User.update({ 'userId': userId }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      });
    }
  });
});
//生成订单
router.post('/payment', function(req, res, next) {
  var userId = req.cookies.userId;
  var orderTotal = req.body.orderTotal;
  var addressId = req.body.addressId;
  User.findOne({ userId, userId }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      //获取当前地址
      var address = '';
      doc.addressList.forEach((item) => {
        if (item.addressId == addressId) {
          address = item;
        }
      });
      //获取购物车商品
      var goodsList = [];
      doc.cartList.filter((item) => {
        if (item.checked == '1') {
          goodsList.push(item);
        }
      });

      var platForm = '622';
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);
      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platForm + r1 + sysDate + r2;
      //生成订单
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      }
      doc.orderList.push(order);
      doc.save(function(err1, doc1) {
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          });
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          });
        }
      });


    }
  });
});
//根据订单id查询订单信息
router.get('/orderDetail', function(req, res, next) {
  var userId = req.cookies.userId;
  var orderId = req.query.orderId;
  User.findOne({ userId, userId }, function(err, userInfo) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var orderList = userInfo.orderList;
      var orderTotal = 0;
      if (orderList.length > 0) {
        orderList.forEach((item) => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal;
          }
        })
        if (orderTotal > 0) {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          });
        } else {
          res.json({
            status: '120002',
            msg: '无此订单',
            result: ''
          });
        }
      } else {
        res.json({
          status: '12001',
          msg: '当前用户未创建订单',
          result: ''
        });
      }
    }
  });
});
//通过cookie判断登陆
router.get('/getCartCount', function(req, res, next) {
  if (req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId;
    User.findOne({ userId: userId }, function(err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        var cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function(item) {
          cartCount += parseInt(item.productNum)
        });
        res.json({
          status: '0',
          msg: '',
          result: cartCount
        });
      }
    });

  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });

  }
});

//增加地址
router.post('/addAddr', function(req, res, next) {
  var userId = req.cookies.userId;
  var newAddr = {
    userName: req.body.userName,
    streetName: req.body.streetName,
    postCode: req.body.postCode,
    tel: req.body.tel,
    isDefault: req.body.isDefault
  };

  User.findOne({ userId: userId }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var addressList = doc.addressList;
      var addressId='';
      addressList.forEach((item) => {
          addressId=item.addressId;
          if (newAddr.isDefault) {
            item.isDefault = false;
          }
      });
      newAddr.addressId=addressId-0+1;
      doc.addressList.push(newAddr);
      doc.save(function(err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          });
        } else {
          res.json({
            status: '0',
            msg: '',
            result: ''
          });
        }
      });
    }
  });
});

module.exports = router;
