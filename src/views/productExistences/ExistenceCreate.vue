<script setup lang="ts">
import type { IProduct } from '@/dto/IProduct';
import type { IProductExistenceData } from '@/dto/input/IProductExistenceData';
import { ProductService } from '@/services/ProductService';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const returnUrl = route.query.returnUrl?.toString() ?? '/';
const queryId = route.query.productId?.toString();
if (!queryId) throw new Error('ID required');
const productId = queryId;

const product = ref(null as IProduct | null);
const productService = new ProductService();

const data = ref({ productId: productId, location: '', amount: 0 } as IProductExistenceData);

onMounted(async () => {
    product.value = await productService.getById(productId);
});

async function submit(event: Event) {
    event.preventDefault();
    await productService.createExistence(data.value);
    await router.push(returnUrl);
}

</script>

<template>
    <div v-if="!product">LOADING</div>
    <template v-else>
        <h1>Create existence entry for {{ product.name }}</h1>

        <RouterLink v-if="returnUrl" :to="returnUrl">Go back</RouterLink>
        <hr />
        <div class="row">
            <div class="col-md-4">
                <form @submit="submit">
                    <div asp-validation-summary="All" class="text-danger"></div>
                    <div class="form-group">
                        <label class="control-label">
                            Amount ({{ product.unit }})
                            <input class="form-control" v-model="data.amount">
                        </label>
                        <label class="control-laber">
                            Location
                            <input class="form-control" v-model="data.location">
                        </label>
                    </div>
                    <div class="form-group">
                        <input type="submit" value="Create" class="btn btn-primary" @click="submit" />
                    </div>
                </form>
            </div>
        </div>
    </template>
</template>
