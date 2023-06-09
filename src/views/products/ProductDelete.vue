<script setup lang="ts">
import type { IProduct } from '@/dto/IProduct';
import { redirectToNotFound } from '@/router/redirects';
import { ProductService } from '@/services/ProductService';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const productService = new ProductService();
const product = ref(null as IProduct | null);

const router = useRouter();
const route = useRoute();
const id = route.query.id?.toString();
if (!id) {
    throw new Error('ID is required');
}

onMounted(async () => {
    product.value = await productService.getById(id);
});

async function submitDelete(event: Event) {
    event.preventDefault();
    if (!id) return await redirectToNotFound();
    await productService.deleteProduct(id);
    await router.push({ name: 'products' });
}
</script>

<template>
    <div v-if="!product">LOADING</div>
    <template v-else>
        <h1>Delete</h1>

        <h3>Are you sure you want to delete this?</h3>
        <div>
            <h4>Product</h4>
            <hr />
            <dl class="row">
                <dt class="col-sm-2">Name</dt>
                <dd class="col-sm-10">{{ product.name }}</dd>
            </dl>

            <button type="submit" class="btn btn-danger" @click="submitDelete">Delete</button> |
            <RouterLink :to="{ name: 'products' }"> Back to List</RouterLink>
        </div>
    </template>
</template>
