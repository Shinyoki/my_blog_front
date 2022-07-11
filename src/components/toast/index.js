import ToastComponent from "./Toast.vue"; // 引入先前写好的vue

const Index = {};

// 注册Toast
Index.install = function(Vue) {
    // 生成一个Vue的子类
    const ToastConstructor = Vue.extend(ToastComponent);
    // 生成一个该子类的实例
    const instance = new ToastConstructor();

    // 将这个实例挂载在我创建的div上
    // 并将此div加入全局挂载点内部
    instance.$mount(document.createElement("div"));
    document.body.appendChild(instance.$el);

    // 通过Vue的原型注册一个方法
    // 让所有实例共享这个方法 <br>    // 其中的duration是持续时间
    Vue.prototype.$toast = (options, duration = 2000) => {
        instance.message = options.message;
        instance.type = options.type;
        instance.visible = true;

        setTimeout(() => {
            instance.show = false;
        }, duration);
    };
    // 成功
    Vue.prototype.$toast.success = (message, duration = 2000) => {
        instance.message = message;
        instance.type = "success";
        instance.visible = true;

        setTimeout(() => {
            instance.show = false;
        }, duration);
    };
    // 失败
    Vue.prototype.$toast.error = (message, duration = 2000) => {
        instance.message = message;
        instance.type = "error";
        instance.visible = true;

        setTimeout(() => {
            instance.show = false;
        }, duration);
    }
    // warning
    Vue.prototype.$toast.warning = (message, duration = 2000) => {
        instance.message = message;
        instance.type = "warning";
        instance.visible = true;

        setTimeout(() => {
            instance.show = false;
        }, duration);
    }
    // primary
    Vue.prototype.$toast.primary = (message, duration = 2000) => {
        instance.message = message;
        instance.type = "primary";
        instance.visible = true;

        setTimeout(() => {
            instance.show = false;
        }, duration);
    }

};

export default Index;
