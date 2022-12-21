<template>
    <button
        :type="nativeType"
        :class="[
            customClasses,
            { 'is-disabled': disabled, 'is-loading': loading },
            `is-${type}`,
            `border-${border}`,
            currentClasses,
        ]"
    >
        <slot />
    </button>
</template>

<script>
export default {
    props: {
        type: {
            default: 'default',
            // 'outlined' || 'default'
        },
        disabled: {},
        loading: {
            type: Boolean,
            default: false
        },
        nativeType: {
            type: String,
            default: 'button',
        },
        border: {
            type: String,
            default: 'primary',
        },
        customClasses: {},
    },
    data() {
        return {
            outlineClasses:
                'focus:outline-none text-primary font-semibold text-lg py-3 px-20 rounded-md bg-white border hover:shadow-lg',
            defaultClasses:
                'focus:outline-none text-white font-semibold text-lg py-3 px-20 rounded-md bg-primary border hover:shadow-lg',
        }
    },
    computed: {
        currentClasses() {
            if (this.type === 'outlined') return this.outlineClasses
            return this.defaultClasses
        },
    },
}
</script>

<style lang="scss" scoped>
.is-disabled {
    pointer-events: none;
    opacity: 0.65;
}
</style>
