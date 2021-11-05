/**
 * Created by lijx on 2020/11/04.
 * https://github.com/breaklinux/op-devops-ui
 */
let menu = {
    menus: [
        {
            key: '/home', desc: 'Dashboard', icon: 'fa fa-desktop', permission: 'home_view',
        },
        {
            key: '1', desc: '用户管理', icon: 'fa fa-address-card', permission: 'account_user_view|account_role_view', subs: [
                {key: '/account/user', permission: 'account_user_view', desc: '用户列表'},
                {key: '/account/role', permission: 'account_role_view', desc: '角色权限'}
            ]
        }, {
            key: '2', desc: '主机管理', icon: 'fa fa-server', permission: 'system_ansible_host_view|assets_host_exec_view', subs: [
                { key: '/assets/ansible', permission: 'system_ansible_host_view', desc: '静态主机'}


            ]
        }, {
            key: '3', desc: '应用发布', icon: 'fa fa-flag-o', permission: 'apps_appname_view|assets_instance_view', subs: [
                { key: '/publish/Appname', permission: 'apps_appname_view', desc: '应用管理'},
                { key: '/publish/Instance', permission: 'assets_instance_view', desc: '实例管理'},
            //    {key: '/publish/menu', permission: 'publish_menu_view', desc: '菜单管理'}
            ]
        },
         {
            key: '4', desc: '配置管理', icon: 'fa fa-cogs', permission: 'config_environment_view|config_service_view|config_app_view', subs: [
                {key: '/configuration/environment', permission: 'config_environment_view', desc: '环境管理'},
            ]
        }, 
        {
            key: '6', desc: '运维Ansible', icon: 'fa fa-tachometer', permission: 'system_ansible_view|system_ansible_run',subs: [
                {key: '/ansible/adhoc', desc: '命令管理'},
            ]
        },
        {
            key: '8', desc: '系统管理', icon: 'el-icon-setting', permission: 'system_channel_uuid_view|system_channel_ipwhilt_view|system_ldap_view',  subs: [
                { key: '/system/ldap', permission: 'system_ldap_view', desc: 'LDAP管理' },
                { key: '/system/uuid', permission: 'system_channel_uuid_view', desc: 'UUID管理' },
                { key: '/system/ip', permission: 'system_channel_ipwhilt_view', desc: 'IP白名单' },
            ]
        },
    ]
};

export default menu;
