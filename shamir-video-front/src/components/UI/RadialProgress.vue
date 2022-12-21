<template>
    <el-progress
        type="circle"
        :percentage="percentage"
        color="#FF0000"
        :indeterminate="true"
        :duration="2"
    >
    <slot>
        <div v-if="prettyTimer">
        {{ prettyTimer }}
        </div>
    </slot>
    </el-progress>
</template>

<script>
import { ElProgress } from 'element-plus'
import 'element-plus/dist/index.css'
import { fancyTimeFormat } from '@/utils/time'

const INTERVAL = 1000

export default {
    name: 'RadialProgress',
    props: {
        progress: {
            default: 60,
        },
        infinite: {
            default: false,
        },
        seconds: {
            type: Number
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
            if (!this.infinite) return this.progress
            return this.timeCount % 100
        },
        prettyTimer() {
            if (!this.seconds || !this.timeCount) return null
            const countdown = this.seconds - this.timeCount
            if (countdown <= 0 ) return this.$t('LOADING_LAST_SECONDS')
            return fancyTimeFormat(countdown)
        }
    },
    watch: {
        infinite(value, oldValue) {
            if (value !== oldValue) this.toggleTimer()
        },
    },
    mounted() {
        if (this.infinite) this.toggleTimer()
    },
    methods: {
        toggleTimer() {
            if (this.isRunning) {
                clearInterval(this.interval)
            } else {
                this.interval = setInterval(this.incrementTime, INTERVAL)
            }
            this.isRunning = !this.isRunning
        },
        incrementTime() {
            this.timeCount = this.timeCount + 1
        },
    },
}
</script>
