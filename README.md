# Hiring Test - Conta Simples
This is a backend aplication to the fullstack developer job in the company Conta Simples


## - Specifications and technologies used here

This project was built using `Nodejs` with `Typescript`.

Here, `node` version is `12.16.3` and the package manager used is `yarn` in version `1.22.5`.

The database used is `Postgres` with `Typeorm` as ORM (object-relational mapping). Besides that, the database is running in a `docker` image of postgres.

In tests, it's used `Jest` and `Coverage` reports to help.

To test the APIs it was used [`Insomnia`](https://insomnia.rest/) and [`DBeaver - v:7.2.1`](https://dbeaver.io/) as a database administration tool.

The archtecture of the project is based in DDD (Domain Driven Design).

## - How to run the project

### Docker

First of all, it's needed to install docker and download the postgres image. To install docker I suggest following instructions in this [link](https://www.notion.so/Instalando-Docker-6290d9994b0b4555a153576a1d97bee2#c7e37c6a26584d33b20cf332f2bdb31d).

After the instalation of docker, we need to create the database container with the correct image. [Here](https://hub.docker.com/_/postgres) you can see the docs of how to download the latest image from Postgres, but here's my suggestion to create the container and downloading image. It's important to follow the `password` and `ports` configuration as they are here. It's better to follow the command in terminal:
```
docker run --name conta_simples -e POSTGRES_PASSWORD=docker -p 5434:5432 -d postgres
```
After creating the container and downloading image, run to check if everything is ok:
```
docker ps
```
### DBeaver

To visualize the database with Dbeaver, open it and click:
- New database connection
- Postgres

A window will open with tab `Main`. There you should set:
- Host: localhost
- Port: 5434
- Database: postgres
- Username: postgres
- Password: docker

In tab `PostgresQL`:
- Show all database: `check the box`

### Project

After downloading the code from the repository (and letting the docker running), run `yarn` to install all the dependencies.

After that, we need to create the tables in database, so run:
```
yarn typeorm migration:run
```
After that, to finish, run:
```
yarn dev:server
```
A message like this should appear in terminal:
```
🤑️ Server started on port 3334!
```
If so, enjoy the application!

### Testing the API

Here I will not teach how to use Insomia, because there are a lot of tutorials out there, but I liked [this one](https://www.youtube.com/watch?v=3tB0uDliS6Y). It's in portuguese.

Here I'll show the best order of testing the API (from Top to Bottom), because after the second, all the others need to configure the token generated in the
`Bearer Token` in Tab Auth in Insomia (the video tutorial shows how to do that. It's used because the next routes need authentication to be accessed).

#### SignUp a company

- Method: `POST`

- Endpoint:
```
http://localhost:3334/companies
```
- Body: `JSON`:
```
{
  TYPES:
  name: string,
  email: string + mail,
  password: string + 6 char,
  company_type: "MEI" | "ME" | "Startup"

  EXAMPLE
	"name": "Aprendiz Digital",
	"email": "aprendizdigital@gmail.com",
	"password": "123456",
	"company_type": "Startup"
}
```
And then `status 200` should come with the new company created data.

#### SignIn

- Method: `POST`

- Endpoint:
```
http://localhost:3334/sessions
```
- Body: `JSON`:
```
{
  TYPES:
  email: string + mail,
  password: string + 6 char

  EXAMPLE
	"email": "aprendizdigital@gmail.com",
	"password": "123456",
}
```
And then `status 200` should come with the company data and the `generated Token`.
It's important to say that when created a new company, an account with `balance = 0.00` is generated in DB as well.
From now on, all the other routes need the generated token to access the routes.

#### Checking Account Balance

- Method: `GET`

- Endpoint:
```
http://localhost:3334/accounts/balance
```
- Body: none

And then `status 200` should come with the amount in balance.

#### Creating Cards

- Method: `POST`

- Endpoint:
```
http://localhost:3334/cards
```
- Body: `JSON`:
```
TYPES:
{
	"total_limit": number,
}

EXAMPLE:
{
	"total_limit": 20000.00
}
```
Here you should set the amount of credit limit this card should have. The ideia is that all cards have `Debit` and `Credit` payment mehods. The credit method is directly connected to the `limit` in a column in the `credit_card` database table, and the debit method always acts in the balance in `account` database table.
The numbers of credit card are generated automatically and they are simple, like `1, 2, 3, ...`. I did this way because I didn't have time to think in a better solution for this problem, so I let this way.
And then `status 200` should come with the credit card data.

#### Listing Cards

- Method: `GET`

- Endpoint:
```
http://localhost:3334/cards
```
- Body: None

And then `status 200` should come with the all the cards data from that account/company.

#### Listing the current limit and total limit of a credit card

- Method: `GET`

- Endpoint:
```
http://localhost:3334/cards/limits/:card_number
```
- Body: None

And then `status 200` should come with the current limit and total limit of the credit card wanted.

#### Creating Transactions

- Method: `POST`

- Endpoint:
```
http://localhost:3334/transactions
```
- Body: `JSON`:
```
TYPES:
{
	"title": string,
  "description"?: string,
	"currency": string,
	"transaction_type": 'Income' | 'Credit' | 'Debit',
	"date": Date,
	"total_value": number,
  "card_number"?: number,
  "intalments"?: number,
}

EXAMPLES:
- INCOME
{
	"title": "Primeiro Depósito",
  "description": "Depósito maluco",
	"currency": "BRL",
	"transaction_type": "Income",
	"date": "{timestamp now 'iso-8601', '' %}",
	"total_value": 15000.00
}
- DEBIT
{
  "title": "Primeira compra no débito",
  "description": "Débito maluco",
	"card_number": 1,
	"currency": "BRL",
	"transaction_type": "Debit",
	"date": "{timestamp now 'iso-8601', '' %}",
	"total_value": 1500.00
}
- CREDIT
{
  "title": "Primeiro Uso do Crédito",
  "description": "Cartão de Crédito maluco",
	"card_number": 1,
	"currency": "BRL",
	"transaction_type": "Credit",
	"date": "{timestamp now 'iso-8601', '' %}",
	"total_value": 200.00,
	"instalments": 2
}
```

All values are calculated based on transactions. So, if money comes in, Income, if money goes out, Debit or Credit. It's important to say that in `Income`, `description, instalments and card_number` are optinal parameters, but you should not use `instalment or card_number` here, there's a bug. In `Debit`, `description and instalments are optional`, but you should never user `instalments`, another bug. In `Credit`, `description, instalments` are really optional.
And then `status 200` should come with the transaction data.

#### Listing all transactions

- Method: `GET`

- Endpoint:
```
http://localhost:3334/transactions
```
- Body: None

And then `status 200` should come with all transactions of that account.
Here `there is not` the filtering part of dates and cards, yet...

#### Listing last transaction

- Method: `GET`

- Endpoint:
```
http://localhost:3334/transactions/last
```
- Body: None

And then `status 200` should come with last transaction data of that account.
