import type { PageServerLoad } from "../$types";
import Stripe from "stripe";
import { PRIVATE_STRIPE_SECRET_KEY } from "$env/static/private";

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY, {
    apiVersion: '2025-04-30.basil'
})

export const load: PageServerLoad = async () => {
    // get available stripe products
    const products = await stripe.products.list({ active: true })

    return { products: products.data }
}