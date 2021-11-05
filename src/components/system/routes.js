/**
 * Created by zyupo on 2017/04/20.
 * https://github.com/openspug/spug
 */

import ldap from './ldap.vue';
import uuid from './uuid.vue';
import ip from './ip.vue';


export default [
    {
        path: 'ldap',
        component: ldap,
        meta: {
            permission: 'system_ldap_view'
        }
    },
    {
        path: 'uuid',
        component: uuid,
        meta: {
            permission: 'system_channel_uuid_view'
        }
    },
    {
        path: 'ip',
        component: ip,
        meta: {
            permission: 'system_channel_ipwhilt_view'
        }
    },
]
