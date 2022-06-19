import Vue from "vue";
import dayjs from "dayjs";
//利用 vue filter机制实现的一个时间格式化函数 {{ dateStr | filterId }}

//Date Format
Vue.filter("date", function (dateStr) {
    return dayjs(dateStr).format("YYYY-MM-DD");
});

//Time Format
Vue.filter("time", function (dateStr) {
    return dayjs(dateStr).format("HH:mm:ss");
});

//Date Time Format
Vue.filter("datetime", function (dateStr) {
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
});

//Year Only
Vue.filter("year", function (dateStr) {
    return dayjs(dateStr).format("YYYY");
});



