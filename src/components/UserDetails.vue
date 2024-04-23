<template>
    <div>
        <div class="user-details">
            <div class="user-header">
                <h2>#{{ userId }}</h2>
                <button @click="goBack">
                    Voltar
                </button>
            </div>
            <div class="user-main" v-if="user">
                <div class="user-avatar">
                    <img :src="user.avatar" alt="Avatar do Usuário">
                </div>
                <div class="user-name">
                    <div>
                        <span>Primeiro nome</span>
                        <div v-if="!isEditing">
                            <strong>{{ user.first_name }}</strong>
                        </div>
                        <div v-else>
                            <input v-model="user.first_name" />
                        </div>
                    </div>
                    <div>
                        <span>Último nome</span>
                        <div v-if="!isEditing">
                            <strong>{{ user.last_name }}</strong>
                        </div>
                        <div v-else>
                            <input v-model="user.last_name" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="user-other" v-if="user">
                <div>
                    <span>Endereço de email</span>
                    <div v-if="!isEditing">
                        <strong>{{ user.email }}</strong>
                    </div>
                    <div v-else>
                        <input v-model="user.email" />
                    </div>
                </div>
                <div>
                    <span>Link do avatar</span>
                    <div v-if="!isEditing">
                        <strong>{{ user.avatar }}</strong>
                    </div>
                    <div v-else>
                        <input v-model="user.avatar" />
                    </div>
                </div>
                <div>
                    <span>Descrição do usuário</span>
                    <div v-if="!isEditing">
                        <strong>{{ userDescription }}</strong>
                    </div>
                    <div v-else>
                        <input v-model="userDescription" />
                    </div>
                </div>
            </div>
            <div class="edit-buttons">
                <button class="confirmation" @click="toggleEdit">
                    {{ isEditing ? 'Salvar' : 'Editar' }}
                </button>
                <button class="cancel" v-if="isEditing" @click="cancelEdit">Cancelar</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "UserDetails",
    data() {
        return {
            userId: null,
            user: null,
            userDescription: "To keep ReqRes free, contributions towards server costs are appreciated!",
            isEditing: false,
            originalUserData: null
        };
    },
    mounted() {
        this.getUserIdFromUrl();
        this.fetchUserData();
    },
    watch: {
        userId(newId) {
            if (newId !== null) {
                this.fetchUserData();
            }
        }
    },
    methods: {
        getUserIdFromUrl() {
            if (this.$route && this.$route.params && this.$route.params.id) {
                const originalUserId = parseInt(this.$route.params.id); // Use `params` em vez de `query`
                this.userId = originalUserId + 0;
            }
        },
        async fetchUserData() {
            if (this.userId !== null) {
                try {
                    const response = await fetch(`https://reqres.in/api/users/${this.userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.data) {
                            this.user = data.data;
                            this.originalUserData = { ...this.user }; // Salvar estado original
                            this.userDescription = "To keep ReqRes free, contributions towards server costs are appreciated!";
                        } else {
                            console.error('O JSON não contém a chave "data".');
                        }
                    } else {
                        console.error('Erro ao buscar os dados do usuário:', response.status);
                    }
                } catch (error) {
                    console.error('Ocorreu um erro:', error);
                }
            }
        },
        toggleEdit() {
            if (this.isEditing) {
                // Aqui você pode adicionar lógica para salvar dados se necessário
            } else {
                // Salvar o estado original para reverter em caso de cancelamento
                this.originalUserData = { ...this.user };
                this.originalUserData.userDescription = this.userDescription;
            }
            this.isEditing = !this.isEditing;
        },
        cancelEdit() {
            // Reverter para o estado original ao cancelar a edição
            this.user = { ...this.originalUserData };
            this.userDescription = this.originalUserData.userDescription;
            this.isEditing = false;
        },
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>


<style scoped>
.user-details span {
    font-size: 14px;
    font-weight: 400;
    line-height: 17.07px;
    color: var(--normal-text);
}

.user-details strong,
.user-details input {
    font-size: 16px;
    font-weight: 600;
    line-height: 19.5px;
}

.user-details input {
    width: 100%;
    border: none;
}

.user-details>.user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-details>.user-header>h2 {
    font-weight: 700;
    font-size: 50px;
    line-height: 61px;
}

.user-details>.user-header>button {
    width: 185px;
    padding-top: 18px;
    padding-bottom: 18px;
    border-radius: 5px;
    text-align: center;
    color: #000;
    font-weight: 600;
    font-size: 15px;
    line-height: 18.29px;
    background-color: #fff;
    border: none;
    cursor: pointer;
}

.user-details>.user-main {
    display: flex;
    flex-direction: column;
    gap: 24px;
    
    @media (min-width: 1086px) {
        flex-direction: row;
        gap: 34px;
    }
}

.user-details>.user-main>.user-avatar>.placeholder {
    width: 120px;
    height: 120px;
    border-radius: 5px;
    background: gray;
}

.user-details>.user-main>.user-avatar>img {
    width: 120px;
    height: 120px;
    border-radius: 5px;
}

.user-details>.user-main>.user-name {
    display: flex;
    gap: 46px;
}

.user-details>.user-main>.user-name>div,
.user-details>.user-other>div {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.user-details>.user-other {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.user-details>.edit-buttons>button {
    width: 185px;
    margin-top: 30px;
    padding-top: 18px;
    padding-bottom: 18px;
    border-radius: 5px;
    text-align: center;
    font-weight: 600;
    font-size: 15px;
    line-height: 18.29px;
    border: none;
    cursor: pointer;
}

.user-details>.edit-buttons {
    margin-top: 10px;
    display: flex;
    gap: 10px;
}

.user-details>.edit-buttons>button.confirmation {
    color: #fff;
    background-color: #000;
}

.user-details>.edit-buttons>button.cancel {
    color: #000;
    background-color: #fff;
}
</style>
