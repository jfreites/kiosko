<template>
	<div class='container content'>
		<br>
		<h3 style='color: white;'>Order complete!</h3>

		<p>Congratulations! Your order for <strong>Seven Stars Clothing &reg;</strong> will be shipped out within 2-5 business days. <a href='#'>support@sevenstarsclothing.com</a>. We sent you a confirmation email for your records. Thanks so much!</p>

		<div v-if='orderDetails'>
			<hr>
			<dl>
				<dt>Order Number</dt>
				<dd>{{ orderDetails.transactions[0].custom }} ({{ orderDetails.id }})</dd>
				<dt>Order Created</dt>
				<dd>{{ orderDetails.create_time | moment }}</dd>
				<dt>Payment Amount</dt>
				<dd>{{ orderDetails.transactions[0].amount.total | currency }}</dd>
                <dt>Shipping Address</dt>
				<dd>{{ orderDetails.transactions[0].item_list.shipping_address.recipient_name }}, 
                    {{ orderDetails.transactions[0].item_list.shipping_address.line1 }}, 
                    {{ orderDetails.transactions[0].item_list.shipping_address.city }} {{ orderDetails.transactions[0].item_list.shipping_address.country_code }},
                    {{ orderDetails.transactions[0].item_list.shipping_address.postal_code }} {{ orderDetails.transactions[0].item_list.shipping_address.state }}
                </dd>
                <dt>Transaction description</dt>
				<dd>{{ orderDetails.transactions[0].description }}</dd>
				<dt>Email</dt>
				<dd>{{ orderDetails.transactions[0].payee.email }}</dd>
			</dl>
			<hr>
			<dl>
				<dt>Notes to payer</dt>
				<dd>{{ orderDetails.note_to_payer }}</dd>
			</dl>
		</div>
	</div>

</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
	data(){
		return {
			orderDetails: false
		};
	},
	created(){
		var charge_id = this.$route.params.id;
		axios.get(`${window.endpoint}/charge/${charge_id}`)
			.then((res)=>{
                console.log(res.data)
				this.orderDetails = res.data.charge;
			});
	},
	filters: {
		moment(date) {
			return moment(date).format('MMMM Do, YYYY - h:mm a');
		},
		currency(amount){
            //return `$${(amount/100).toFixed( 2 )}`;
            return `$${(amount)}`;
		}
	}
}

</script>
<style scoped>
	dt { font-weight: bold; }
</style>