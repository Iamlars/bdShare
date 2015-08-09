/*
 * Share v0.0.1
 * require jquery 1.7+
 * author
 *
 * MIT License
 *
 */

;
(function($) {

    function Share(uid) {

        /**
         * 初始化分享
         * @param  {String} uid  用户的百度分享AK
         * @return this;
         *
         */

        if (!(this instanceof Share)) {
            return new Share();
        }

        this.uid = uid;
        this.url = 'http://s.share.baidu.com/';
        this.title = document.title;
        this.size = 'height=500,width=700,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no';

        this.init();
    }

    Share.prototype = {
        // 虽然我不需要继承，但是每个人都提醒我少个构造器标识，所以我加上他了。
        constructor: 'Share',
        init: function () {
            var that = this;

            $('body').off('click.share', '.btn-share').on('click.share', '.btn-share', function () {
                var _self = $(this),
                    type = _self.data('type'),
                    data = _self.parent('.share-list').data();
                that.fire(type, data);
            });
        },
        fire: function (t, d) {
            var query = this.set(t, d);
            this.load(query);
            this.open(query);
        },

        /**
         * 设置分享内容
         * @param  {String} type 分享到的社交媒体，如tsina,qqzone，以data-type的形式存储在 .btn-share 标签上
         * @param  {Object} data 需要分享的hash表，以data-***的形式存储在 .share-list 标签上
         * @return {String} queryString  序列化的分享内容url字符串;
         *
         */
        set: function (type, data) {
            var query = {};
            query.click = 1;
            query.url = encodeURIComponent(data.url || "");
            query.uid = this.uid;
            query.to = type;
            query.type = "text";
            query.relateUid = data.wbuid || "";
            query.pic = encodeURIComponent(data.pic || "");
            query.title = this._formatTitle(data.text);
            query.key = "";
            query.sign = "on";
            query.desc = encodeURIComponent(data.desc || "");
            query.comment = encodeURIComponent(data.comment || "");
            query.searchPic = 0;
            query.l = this.time();
            query.linkid = this.string();
            query.sloc = "";
            query.apiType = 0;
            query.buttonType = 0;

            return '?' + $.param(query);
        },

        /**
         * 统计分享次数
         * @param  {String} query 序列化的分享内容url字符串
         *
         */
        load: function (query) {
            var img = new Image();
            img.onload = function () {
                img = img.onload = null;
            };
            img.src = this.url + "commit" + query + "&t=" + Math.random();
        },

        /**
         * 打开分享窗体
         * @param  {String} query 序列化的分享内容url字符串
         *
         */
        open: function (query) {
            var that = this;
            window.open(that.url + query, "_blank", that.size);
        },

        /**
         * 算法来自 今日头条 没看懂
         *
         */
        time: function () {
            var t = +new Date,
                e = t + 1000,
                n = t + 3000;
            return t.toString(32) + e.toString(32) + n.toString(32)
        },

        string: function () {
            var t = (new Date).toString(36),
                e = Math.random().toString(36).substr(3);

            return t + e
        },

        /**
         * 格式化分享的title
         * @return  {String} str
         * todo: 如果内容中含有新浪微博需要@的账号，那么在其他社交分享中应该替换掉它；
         *
         */
        _formatTitle: function (text) {
            return text ? encodeURIComponent(text.substring(0, 300)) : this.title;
        },

        /**
         * 算法来自 今日头条 没看懂
         * str '0123456789abcdefghijklmnopqrstuvwxyz'
         */
        _randomString: function (str, e) {
            var n = str.length,
                o = "",
                i = 1;
            while (i < n) {
                var a = Math.floor(n * Math.random());
                o += str.charAt(a);
                i++;
            }

            return o
        }
    };

    window.Share = function(){
        return Share();
    }

}(window.jQuery));


