<script setup lang="ts">
import type { IProduct } from '@/dto/IProduct';
import type { IProductExistence } from '@/dto/IProductExistence';
import { ProductService } from '@/services/ProductService';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const returnUrl = route.query.returnUrl?.toString() ?? '/';
const queryRouteId = route.query.productId?.toString();
if (!queryRouteId) throw new Error('ID required');
const queryId = route.query.id?.toString();
if (!queryId) throw new Error('Id required');
const id = queryId;
const productId = queryRouteId;

const product = ref(null as IProduct | null);
const existence = ref(null as IProductExistence | null);
const productService = new ProductService();

onMounted(async () => {
    product.value = await productService.getById(productId);
    existence.value = await productService.getExistenceById(id);
});

async function submit(event: Event) {
    event.preventDefault();
    if (!existence.value) return;
    await productService.updateExistence(id, {
        productId: productId,
        amount: existence.value.amount,
        location: existence.value.location
    });
    await router.push(returnUrl);
}
</script>

<template>
    <div v-if="!product || !existence">LOADING</div>
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
                            <input class="form-control" v-model="existence.amount" />
                        </label>
                        <label class="control-laber">
                            Location
                            <input class="form-control" v-model="existence.location" />
                        </label>
                    </div>
                    <div class="form-group">
                        <input
                            type="submit"
                            value="Create"
                            class="btn btn-primary"
                            @click="submit"
                        />
                    </div>
                </form>
            </div>
        </div>
    </template>
</template>
