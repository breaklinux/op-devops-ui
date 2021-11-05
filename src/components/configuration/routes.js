/**
 * Created by lijx on 2020/11/04.
 * https://github.com/breaklinux/op-devops-ui
 */
import Environment from './Environment.vue'
import RelationChart from './RelationChart.vue'

export default [
    {
        path: 'environment',
        component: Environment,
        meta: {
            permission: 'config_environment_view'
        }
    },
    {
        path: 'relationship',
        component: RelationChart,
        meta: {
            permission: 'config_app_view'
        }
    }
];