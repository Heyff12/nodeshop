var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../model/goods');
// var options = {  
//     server: {
//         auto_reconnect: true,
//         poolSize: 10
//     }
// };
mongoose.connect('mongodb://127.0.0.1:27017/dumall', {
  useMongoClient: true,
  /* other options */
  // auto_reconnect: true,
  // poolSize: 10
});

mongoose.connection.on('connected', function() {
  console.log('mongodb connected success');
});
mongoose.connection.on('error', function() {
  console.log('mongodb connected fail');
});
mongoose.connection.on('disconnected', function() {
  console.log('mongodb connected disconnected');
});

//查询商品列表数据
router.get('/list', function(req, res, next) {
  //res.send('hello,goods list');//测试显示内容
  // let page = parseInt(req.query('page'));//报错，获取不到
  // let pageSize = parseInt(req.query('pageSize'));//报错，获取不到
  // let sort = req.query('sort');//报错，获取不到
  let page = parseInt(req.query.page) || 1;
  let pageSize = parseInt(req.query.pageSize) || 6;
  let sort = req.query.sort || 1;
  let priceLevel = req.query.priceLevel || all;
  let skip = (page - 1) * pageSize;
  // console.log(page);
  // console.log(pageSize);
  // console.log(sort);

  let params = {};
  var priceGt = '',
    priceLte = '';
  if (priceLevel !== 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({ 'salePrice': sort });
  goodsModel.exec(function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
  // Goods.find({},function(err, doc) {
  //   if (err) {
  //     res.json({
  //       status: '1',
  //       msg: err.message
  //     })
  //   } else {
  //     res.json({
  //       status: '0',
  //       msg: '',
  //       result: {
  //         count: doc.length,
  //         list: doc
  //       }
  //     })
  //   }
  // })
});
//加入到购物车
router.post('/addCart', function(req, res, next) {
  var userId = '100000077',
    productId = req.body.productId;
  var User = require('../model/user');
  User.findOne({ userId: userId }, function(err, userDoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      console.log('userDoc:' + userDoc);
      if (userDoc) {
        let goodsItem = '';
        userDoc.cartList.forEach(function(item) {
          if (item.productId == productId) {
            console.log('item:' + item);
            goodsItem = item;
            item.productNum++;
          }
        });
        if (goodsItem) {
          userDoc
            .save(function(err2, doc2) {
              if (err2) {
                res.json({
                  status: '1',
                  msg: err2.message
                })
              } else {
                res.json({
                  status: '0',
                  msg: '',
                  result: 'success'
                })
              }
            });

        } else {
          Goods.findOne({ productId: productId }, function(err1, doc) {
            if (err1) {
              res.json({
                status: '1',
                msg: err1.message
              })
            } else {
              if (doc) {
                doc.productNum = 1;
                doc.checked = 1;
                //console.log('doc:' + doc);
                userDoc.cartList.push(doc);
                userDoc.save(function(err2, doc2) {
                  if (err2) {
                    res.json({
                      status: '1',
                      msg: err2.message
                    })
                  } else {
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'success'
                    })
                  }
                });
              }

            }
          });
        }
      }
    }
  });
});
module.exports = router;
