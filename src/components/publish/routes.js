/**
 * Created by lijx on 2020/11/04.
 * https://github.com/breaklinux/op-devops-ui
 */

import AppName from './Application.vue'
import InsTance from './Instance.vue'
import JenKins  from './Jenkins.vue'
export default [
    {
        path: 'Appname',
        component: AppName,
        meta: {
            permission: 'apps_appname_view'
        }
    },
    {
        path: 'Instance',
        component: InsTance,
        meta: {
            permission: 'assets_instance_view'
        }
    },
    {
        path: 'Jenkins',
        component: JenKins,
        meta: {
            permission: 'apps_jenkins_view'
        }
    },
]
