<template>
    <div>
        <div class="w-full py-3">
            <Button> Submit </Button>
            <Button type="outlined"> Submit </Button>
        </div>
        <Steps :steps="5" :active="1" class="w-screen" />
        <div class="w-full my-5">
            <Button @click="showModal = true">Show modal</Button>
            <Modal :show="showModal" @close="showModal = false">
                Hello world!
            </Modal>
        </div>
        <div class="w-full my-5">
            <TextInput isError>
                <template v-slot:label> Enter your store information </template>
                <template v-slot:description>
                    as you would like it to appear in the closing slide of your
                    video
                </template>
                <template v-slot:error> Enter your store information </template>
            </TextInput>
        </div>
        <div class="my-5">
            <Select
                :value="selectValue"
                :options="['kek', 'lol', 'pep']"
            ></Select>
        </div>
        <div class="my-5">
            <FlagOptionsSelect :options="flagOptions" />
        </div>
        <Loading></Loading>
        <RadialProgress :infinite="true" :seconds="5" ></RadialProgress>
        <LinearProgress :progress="66" />
        <ImageInput />
    </div>
</template>

<script>
import Button from '../components/UI/Button.vue'
import Steps from '../components/UI/Steps.vue'
import Modal from '../components/UI/Modal.vue'
import TextInput from '../components/UI/TextInput.vue'
import Select from '../components/UI/Select.vue'
import FlagOptionsSelect from '../components/forms/FlagOptionsSelect.vue'
import Loading from '../components/UI/Loading.vue'
import ImageInput from '@/components/UI/ImageInput.vue'
import RadialProgress from '@/components/UI/RadialProgress.vue'
import LinearProgress from '@/components/UI/LinearProgress.vue'

export default {
    components: {
        Button,
        Steps,
        Modal,
        TextInput,
        Select,
        FlagOptionsSelect,
        Loading,
        ImageInput,
        RadialProgress,
        LinearProgress
    },
    data() {
        return {
            showModal: false,
            selectValue: 2,
            flagOptions: [
                {
                    label: 'English',
                    code: 'english',
                    flag: 'uk',
                },
                {
                    label: 'Русский',
                    code: 'russian',
                    flag: 'ru',
                },
            ],
        }
    },
}
</script>
