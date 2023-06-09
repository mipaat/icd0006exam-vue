<script setup lang="ts">
import type { IProductExistence } from '@/dto/IProductExistence';
import { useRoute } from 'vue-router';

export interface IProps {
    existence: IProductExistence;
}
defineProps<IProps>();

const route = useRoute();

function getDisplayText(existence: IProductExistence) {
    return `${existence.amount} (${existence.product.unit}s)` + (existence.location
        ? ` at ${existence.location}`
        : '');
}
</script>

<template>
    <div>
        <RouterLink :to="{ name: 'existenceEdit', query: { id: existence.id, productId: existence.product.id, returnUrl: route.fullPath } }">{{ getDisplayText(existence) }}</RouterLink>
    </div>
</template>
