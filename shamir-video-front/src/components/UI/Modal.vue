<template>
    <teleport to="body" class="modal">
        <transition
            enter-active-class="transition ease-out duration-200 transform"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-200 transform"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                ref="modal-backdrop"
                class="modal-backdrop fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
                v-show="showModal"
            >
                <div
                    class="modal-wrap flex items-start justify-center min-h-screen pt-24 text-center"
                >
                    <transition
                        enter-active-class="transition ease-out duration-300 transform "
                        enter-from-class="opacity-0 translate-y-10 scale-95"
                        enter-to-class="opacity-100 translate-y-0 scale-100"
                        leave-active-class="ease-in duration-200"
                        leave-from-class="opacity-100 translate-y-0 scale-100"
                        leave-to-class="opacity-0 translate-y-10 translate-y-0 scale-95"
                    >
                            <slot class="modal" name="container">
                                <div
                                    v-click-outside="vcoConfig"
                                    class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl p-8 w-1/2"
                                    :class="modalContainerClass"
                                    role="dialog"
                                    aria-modal="true"
                                    ref="modal"
                                    v-show="showModal"
                                    aria-labelledby="modal-headline"
                                >
                                    <slot>I'm empty inside</slot>
                                </div>
                            </slot>
                    </transition>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script>
import { ref, watch } from 'vue'
// import useClickOutside from '../../composables/useClickOutside'

const props = {
    show: {
        type: Boolean,
        default: false,
    },
    modalContainerClass: {
        type: String,
        default: '',
    },
}
export default {
    name: 'Modal',
    props,
    emits: ['close'],
    setup(props, { emit }) {
        const showModal = ref(false)

        const modal = ref(null)
        // const { onClickOutside } = useClickOutside()

        function closeModal() {
            showModal.value = false
            emit('close')
        }

        watch(
            () => props.show,
            (show) => {
                showModal.value = show
            }
        )

        // onClickOutside(modal, () => {
        //   if (showModal.value === true) {
        //     closeModal()
        //   }
        // })

        return {
            closeModal,
            showModal,
            modal,
        }
    },

    methods: {
        middleware(event) {
            return event.target.className.includes('modal-wrap')
        },
        onClickOutside() {
            this.closeModal()
        },
    },
    data() {
        return {
            vcoConfig: {
                handler: this.onClickOutside,
                middleware: this.middleware,
                events: ['click'],
                // Note: The default value is true, but in case you want to activate / deactivate
                //       this directive dynamically use this attribute.
                isActive: true,
                // Note: The default value is true. See "Detecting Iframe Clicks" section
                //       to understand why this behaviour is behind a flag.
                detectIFrame: true,
                // Note: The default value is false. Sets the capture option for EventTarget addEventListener method.
                //       Could be useful if some event's handler calls stopPropagation method preventing event bubbling.
                capture: false,
            },
        }
    },
}
</script>
