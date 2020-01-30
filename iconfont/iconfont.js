Component({
  properties: {
    // mathojfenxiang3 | mathojguanzhu | mathojkefu | mathojxinwenti | mathojjigoujiangbei | mathojjiangbei | mathojduoxuanshanchu | mathojmeiriyiti | mathojbofang | mathojjigou | mathojwodexuesheng | mathojwodelaoshi | mathojshenqingzhong | mathojjiedati | mathojkaishiluyin | mathojyicaina | mathojxiehuida | mathojcaina | mathojshengyuduanxin | mathojliuyan | mathojbeicaina | mathojjieda | mathojjiantou | mathojdiscover | mathojfanhuidingbu | mathojprincipal | mathojqingshangchuan | mathojdianzan | mathojtongguo | mathojstudent | mathojliulan | mathojjiangpai | mathojtichu | mathojdianzan_active | mathojyaoqing | mathojzhishi | mathoj-hao | mathojtiwen | mathojqiehuanshenfen | mathojshanchu | mathojhuozhe | mathojtupian | mathojdingyue | mathojzhishidian | mathojgengduo | mathojxiala1-copy | mathojjujue | mathojtongpai | mathojwentimiaoshu | mathojzanting | mathojjinsheng | mathojicon-anonymous | mathojyuedushu | mathojpaihangbang | mathojxitongxiaoxi | mathojhao | mathojsoushuo | mathojpass | mathojshipin | mathojtuiguangma | mathojrili | mathojlocation | mathojdaanjiexi | mathojqianyitian | mathojteacher | mathojjinpai | mathojjieshuluyin | mathojjintian | mathojxunzhang | mathojchengyuan | mathojtijiao | mathojnianji | mathojweidu | mathojtuichu | mathojcancel | mathojdianhua | mathojyinpai | mathojdianzan_inactive | mathojshoucang | mathojjiaru | mathojshalou | mathojquanxuan | mathojdaka | mathojlajixiang | mathojyiyaoqing | mathojziliao | mathojchulishenqing | mathojfuzhi | mathojtixing | mathojshaixuan | mathojdianjijinru
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 18,
      observer: function(size) {
        this.setData({
          svgSize: size,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 18,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
