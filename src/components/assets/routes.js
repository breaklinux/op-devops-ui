/**
 * Created by zyupo on 2017/04/20.
 * https://github.com/openspug/spug
 */
import Ansible from './Host.vue'

export default [
    {
        path: 'ansible',
        component: Ansible,
        meta: {
            permission: 'system_ansible_host_view'
        }
    }

]
