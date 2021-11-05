/**
 * Created by lijx on 2020/11/04.
 * https://github.com/breaklinux/op-devops-ui
 */
import adhoc from './adhoc.vue'

export default [
    {
        path: 'adhoc',
        component: adhoc,
        meta: {
            permission: 'system_ansible_view'
        }
    }
]