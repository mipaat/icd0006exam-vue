<script setup lang="ts">
import type { IProduct } from '@/dto/IProduct';
import type { IProductExistence } from '@/dto/IProductExistence';
import { ProductService, getProductTotalAmount, getExistencesFor } from '@/services/ProductService';
import { useIdentityStore } from '@/stores/identityStore';
import { onMounted, ref } from 'vue';
import ProductExistenceComponent from '@/components/ProductExistenceComponent.vue';
import { useRoute } from 'vue-router';

export interface IProps {
    products: IProduct[];
}
const route = useRoute();
const props = defineProps<IProps>();

const identityStore = useIdentityStore();
const productService = new ProductService();
const productExistences = ref(null as IProductExistence[] | null);

onMounted(async () => {
    productExistences.value = await productService.getExistences();
});
</script>

<template>
    <div v-if="!productExistences">LOADING</div>
    <div v-else-if="identityStore.jwt">
        <template v-if="props.products.length === 1">
            <div>
                <h6>Total: {{ getProductTotalAmount(props.products[0], productExistences) }}</h6>
                <ProductExistenceComponent
                    :existence="existence"
                    v-for="(existence, index) in getExistencesFor(
                        props.products[0],
                        productExistences
                    )"
                    :key="index"
                />
                <RouterLink
                    :to="{
                        name: 'existenceCreate',
                        query: { productId: props.products[0].id, returnUrl: route.fullPath }
                    }"
                    >Create new</RouterLink
                >
            </div>
        </template>
        <template v-else>
            <div v-for="product in props.products" :key="product.id">
                <button
                    type="button"
                    class="btn btn-danger dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="true"
                >
                    {{ product.name }}
                </button>
                <ul class="dropdown-menu">
                    <div>
                        <h6>Total: {{ getProductTotalAmount(product, productExistences) }}</h6>
                    </div>
                    <ProductExistenceComponent
                        :existence="existence"
                        v-for="(existence, index) in getExistencesFor(product, productExistences)"
                        :key="index"
                    />
                    <RouterLink
                        :to="{
                            name: 'existenceCreate',
                            query: { productId: product.id, returnUrl: route.fullPath }
                        }"
                        >Create new</RouterLink
                    >
                </ul>
            </div>
        </template>
    </div>
</template>
