<template>
    <div>
        <div class="user-main">
            <div class="user-header">
                <h1>Usuários</h1>
                <button :class="isButtonActive" @click="toggleForm">{{ buttonText }}</button>
            </div>
            <form v-if="formVisible" @submit.prevent="addUser">
                <div>
                    <label for="user-name">Nome do usuário</label>
                    <input required v-model="newUser.name" name="user-name" type="text" />
                </div>
                <div>
                    <label for="user-function">Função do usuário</label>
                    <button class="user-function" @click.prevent="toggleListVisibility">
                        <span style="color: var(--normal-text)">{{ listButtonText }}</span>
                        <ArrowIcon />
                    </button>
                    <ul v-show="isListVisible">
                        <li @click="handleListItemClick('Desenvolvedor')">Desenvolvedor</li>
                        <li @click="handleListItemClick('Gerente de Projetos')">Gerente de Projetos</li>
                        <li @click="handleListItemClick('Tech Lead')">Tech Lead</li>
                        <li @click="handleListItemClick('UI/UX Designer')">UI/UX Designer</li>
                    </ul>
                </div>
                <button class="action-btn" type="submit">Salvar dados do usuário</button>
            </form>
        </div>
        <ul class="user-listing">
            <li v-for="user in users" :key="user.id">
                <div class="user-wrapper">
                    <div class="user-info">
                        <div class="user-avatar">
                            <template v-if="user.avatar">
                                <img :src="user.avatar" alt="User Image" @error="handleImageError(user)">
                            </template>
                            <div v-else class="image-placeholder"></div>
                        </div>
                        <div class="user-data">
                            <span>#{{ user.id }}</span>
                            <strong>{{ user.first_name }} {{ user.last_name }}</strong>
                            <span>{{ user.email }}</span>
                        </div>
                    </div>
                    <div class="user-options">
                        <button>
                            <router-link :to="{ name: 'users', params: { id: user.id } }">
                                <EditIcon />
                            </router-link>
                        </button>
                        <button class="delete-user" @click="deleteUser(user.id)">
                            <DeleteIcon />
                        </button>
                        <button>
                            <router-link :to="{ name: 'users', params: { id: user.id } }">
                                <ViewIcon />
                            </router-link>
                        </button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import EditIcon from "@/icons/EditIcon.vue";
import DeleteIcon from "@/icons/DeleteIcon.vue";
import ViewIcon from "@/icons/ViewIcon.vue";
import ArrowIcon from "@/icons/ArrowIcon.vue";

export default {
    name: "UserListing",
    components: {
        EditIcon,
        DeleteIcon,
        ViewIcon,
        ArrowIcon
    },
    data() {
        return {
            users: [],
            newUser: {
                name: '',
                job: ''
            },
            formVisible: false,
            isListVisible: false,
            listButtonText: "Selecione a função"
        };
    },
    computed: {
        buttonText() {
            return this.formVisible ? "Cancelar" : "Novo usuário";
        },
        isButtonActive() {
            return this.formVisible ? "action-btn active" : "action-btn";
        }
    },
    methods: {
        toggleListVisibility() {
            this.isListVisible = !this.isListVisible;
        },
        toggleForm() {
            this.formVisible = !this.formVisible;
        },
        resetForm() {
            this.newUser = {
                name: '',
                job: ''
            };
        },
        handleOutsideClick(event) {
            if (!this.$el.contains(event.target)) {
                this.isListVisible = false;
            }
        },
        handleListItemClick(functionText) {
            this.listButtonText = functionText;
            this.isListVisible = false;
        },
        addUser() {
            const names = this.newUser.name.split(" ");
            const firstName = names.shift();
            const lastName = names.join(" ");
            const maxId = this.users.reduce((max, user) => Math.max(max, user.id), 0);
            const newId = maxId + 1;

            const userData = {
                id: newId,
                first_name: firstName,
                last_name: lastName,
                job: this.listButtonText === 'Selecione a função' ? '' : this.listButtonText
            };

            fetch('https://reqres.in/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
                .then(response => response.json())
                .then(data => {
                    if (!data.id) data.id = newId;
                    this.users.push(data);
                    this.toggleForm();
                    console.log('Usuário adicionado:', data);
                })
                .catch(error => {
                    console.error('Erro ao adicionar usuário:', error);
                })
                .finally(() => {
                    this.resetForm();
                });
        },
        deleteUser(userId) {
            // Filtra a lista de usuários para remover o usuário com o ID fornecido
            this.users = this.users.filter(user => user.id !== userId);
            
            // Se necessário, faça uma requisição à API para deletar o usuário
            fetch(`https://reqres.in/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log(`Usuário com ID ${userId} deletado com sucesso.`);
                } else {
                    console.error(`Erro ao deletar usuário com ID ${userId}.`);
                }
            })
            .catch(error => {
                console.error(`Erro ao deletar usuário com ID ${userId}:`, error);
            });
        }
    },
    mounted() {
        fetch("https://reqres.in/api/users")
            .then(response => response.json())
            .then(data => {
                this.users = data.data;
            })
            .catch(error => {
                console.error("Erro ao buscar os dados dos usuários:", error);
            });

        document.addEventListener('click', this.handleOutsideClick);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleOutsideClick);
    }
};
</script>

<style scoped>
.user-main {
    padding-bottom: 20px;
}

.user-main button.action-btn {
    width: 100%;
    padding-top: 18px;
    padding-bottom: 18px;
    border-radius: 5px;
    text-align: center;
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    line-height: 18.29px;
    background-color: #000;
    border: none;
    cursor: pointer;
}

.user-main>.user-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    @media (min-width: 768px) {
        flex-direction: row;
    }
}

.user-main>.user-header>h1 {
    font-weight: 700;
    font-size: 50px;
    line-height: 61px;
}

.user-main>.user-header>button.action-btn {
    width: 185px;
}

.user-main>.user-header>button.action-btn.active {
    background: #fff;
    color: #000;
}

.user-main>form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.user-main>form>div {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
}

.user-main>form>div>ul {
    position: absolute;
    width: 100%;
    background: #fff;
    top: 100%;
    margin: 0;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-main>form>div>ul>li {
    list-style: none;
    font-size: 15px;
    font-weight: 400;
    line-height: 18.29px;
    cursor: pointer;
}


.user-main>form>div>ul>li+li {
    margin-top: 17px;
}

.user-main>form>div>input,
.user-main>form>div>button.user-function {
    font-size: 15px;
    padding: 20px 18px;
    border-radius: 5px;
    border: 1px solid var(--input-border);
}

.user-main>form>div>button.user-function {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.user-main>form>div>label {
    font-size: 16px;
    font-weight: 600;
    line-height: 19.5px;
}

.user-listing {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.user-listing>li {
    display: flex;
    list-style: none;
    gap: 30px;
    padding: 20px 30px 20px 0;
    background-color: #F7F7F7;
}

.user-listing>li::before {
    width: 4px;
    height: 20px;
    background: #000;
    content: '';
}

.user-listing>li>.user-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    gap: 10px;

    @media (min-width: 768px) {
        flex-direction: row;
        gap: 0;
    }
}

.user-listing>li>.user-wrapper>.user-info {
    display: flex;
    gap: 25px;
    align-items: center;
}

.user-listing>li>.user-wrapper>.user-info>.user-avatar>img {
    width: 80px;
    height: 80px;
    border-radius: 5px;
}

.user-listing>li>.user-wrapper>.user-info>.user-avatar>.image-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    background: gray;
}

.user-listing>li>.user-wrapper>.user-info>.user-data {
    display: flex;
    flex-direction: column;
}

.user-listing>li>.user-wrapper>.user-info>.user-data>span {
    font-size: 16px;
    font-weight: 400;
    line-height: 19.5px;
    color: var(--normal-text);
}

.user-listing>li>.user-wrapper>.user-info>.user-data>strong {
    font-size: 18px;
    font-weight: 600;
    line-height: 21.94px;
    margin-top: 10px;
    margin-bottom: 3px;
}

.user-listing>li>.user-wrapper>.user-options {
    display: flex;
    align-items: center;
    gap: 17px;
}

.user-listing>li>.user-wrapper>.user-options>button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
}
</style>
