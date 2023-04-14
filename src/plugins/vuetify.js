import Vue from "vue";
import Vuetify from "vuetify/lib";
import { en, zhHans} from "./locales";

Vue.use(Vuetify);
const opts = {
    lang: {
        current: 'zhHans',
        locales: { zhHans, en }
    }
};

export default new Vuetify(opts);