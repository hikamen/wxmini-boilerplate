Component({
    data: {
        active: 0,
        list: [
            {
                icon: 'newspaper-o',
                text: '活动简介',
                url: '/pages/intro/index'
            },
            {
                icon: 'home-o',
                text: '活动中心',
                url: '/pages/home/index'
            },
            {
                icon: 'user-o',
                text: '个人中心',
                url: '/pages/user/index'
            }
        ]
    },

    methods: {
        onChange(event) {
            console.log(event);
            this.setData({ active: event.detail });
            wx.switchTab({
                url: this.data.list[event.detail].url
            });
        },

        init() { 
            const page = getCurrentPages().pop();
            this.setData({
                active: this.data.list.findIndex(item => item.url === `/${page.route}`)
            });
        }
    }
});
