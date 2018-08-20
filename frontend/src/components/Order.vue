<template>
    <div class='container'>
        <div class='columns'>
            <div class='column is-4'>
                <img src="https://cdn.scotch.io/2842/b7yhhuUPSGO1fEkMHD6P_sticks.jpeg" alt="A bundle of sticks">
            </div>
            <div class='column is-4'>            
                <div class='field'>
                    <label>Name</label>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input" type="text" placeholder="First and Last" v-model='name'>
                        <span class="icon is-small is-left">
                          <i class="fa fa-user"></i>
                        </span>
                    </div>
                </div>
                <div class="field">
                    <label>Email</label>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input" type="text" placeholder="Email address" v-model='email'>
                        <span class="icon is-small is-left">
                            <i class="fa fa-envelope"></i>
                        </span>
                    </div>
                </div>

                <hr id='left-line'>

                <div class="field">
                    <label>Address</label>
                    <input type='text' class='input' v-model='address.street' placeholder='123 Fake St #303'>
                </div>
                <div class="field">
                    <label>City</label>
                    <input type='text' class='input' v-model='address.city' placeholder='San Francisco'>
                </div>
                                
            </div>
            <div class='column is-4'>         
                <label>Instructions</label>
                <textarea class="textarea" placeholder="What would you like the note to say?" v-model='engravingText'></textarea>
                
                <hr>
                
                <div class="field">
                    <label>State</label>
                    <input type='text' class='input' v-model='address.state' placeholder='CA'>
                </div>
                <div class="field">
                    <label>Zip</label>
                    <input type='text' class='input' v-model='address.zip' placeholder='94607'>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class='column is-12'>
                <button type="submit" class="button is-primary is-large is-pulled-right" @click="validate" :disabled="paymentCheckSending">
                    <span v-if="paymentCheckSending">
                        <i class="fa fa-btn fa-spinner fa-spin"></i> 
                        Ordering...
                    </span>
                    <span v-else>
                        Place Order
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data(){
        return {
            // fields
            name: 'Jon Doe',
            email: 'jondoe@emailfake.com',
            engravingText: 'Additional instructions for my order',
            address: {
                street: '123 Something Lane',
                city: 'San Francisco',
                state: 'CA',
                zip: '94607'
            },

            // validation
            paymentCheckSending: false,
            paypalCheckError: false,
            paypalErrorMessage: ''
        }
    },
    methods: {
        validate() {
            // Some validations here....
            let valid = true;

            if (valid) {
                // **********************
                this.paymentCheckSending = true;
                // BEGIN ->
                var request = {
                    name: this.name,
                    email: this.email,
                    engravingText: this.engravingText,
                    address: this.address,
                    card: this.card,
                    token_from_stripe: 'none'
                };
                // Send to our server
                axios.post(`${window.endpoint}/charge`, request)
                    .then((res) => {
                        var error = res.data.error;
                        var charge = res.data.charge;
                        if (error){
                            console.error(error);
                        } else {
                            this.$router.push({ path: `order-complete/${charge.id}` })
                        }
                    });
                // ***********************
            }
        }
    }
}
</script>

<style scoped>
h2 { text-decoration: underline; }
.textarea:not([rows]) { max-height: 110px; min-height: 110px; }
.container { margin-bottom: 30px; }
.column > img { margin-top: 60px; }
.button-field { display: flex; justify-content: center; }
#left-line { margin-top:27px; }
</style>