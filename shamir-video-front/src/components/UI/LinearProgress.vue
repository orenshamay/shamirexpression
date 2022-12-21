<template>
    <el-progress
        :percentage="percentage"
        color="#FF0000"
        :text-inside="true" 
        :stroke-width="26"
        :indeterminate="isInfinite"
    >
        <slot>
        </slot>
    </el-progress>
</template>

<script>
import { ElProgress } from 'element-plus'
import 'element-plus/dist/index.css'

export default {
    name: 'LinearProgress',
    props: {
        progress: {
            default: 60,
        },
        isInfinite: {
            type: Boolean,
            default: false
        }
    },
    components: { ElProgress },
    data() {
        return {
            timeCount: 0,
            isRunning: false,
            interval: null,
        }
    },
    computed: {
        percentage() {
            return this.progress
        }
    }
}
</script>
