# Order Management System

## Overview

Order Management System (OMS) is an API that allows users to manage their orders, carts, and products within an e-commerce mobile app. It provides CRUD operations for users, products, orders, and cart management.

[![technologies](https://skillicons.dev/icons?i=nestjs,ts,prisma,postgresql,git,github,postman,docker)](#backend)

## Table of Contents

- [Order Management System](#order-management-system)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Schema Diagram for DB](#schema-diagram-for-db)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Endpoints](#endpoints)
  - [Technology Stack](#technology-stack)
      - [Backend](#backend)
      - [Documentation](#documentation)
      - [Version Control](#version-control)
  - [How to Contribute](#how-to-contribute)

## Schema Diagram for DB
![schema](docs/schema.png)

## Getting Started

### Prerequisites

Before getting started, ensure you have installed the following:

- Node.js and npm
- PostgreSQL

### Installation

1. Clone the repository: `$ git clone git@github.com:MohamedAEmara/Order-Management-System.git`
2. Install dependencies: `$ npm install`
3. Configure environment variables: Create a `.env` file in the root directory.
   - Copy `.env.example` content to `.env` file
   - Add values for environment variables
    ```bash
       DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
       SECRET="SOME_SECRET_VALUE"
4. Migrate Prisma schema to the database by running these commands:
      ```bash
       $ npx prisma generate
       $ npx prisma migrate dev --name init
   
  
## Endpoints

You can check endpoints & documentation on Postman from [here](https://documenter.getpostman.com/view/29997574/2sA3XWbdQF)

## Technology Stack

The **Order Management System** uses the following technologies and tools:

#### Backend

- **NestJS:** A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **PostgreSQL:** A powerful, open-source relational database used for storing users, products, orders, and cart information.
- **Prisma:** A modern database toolkit and ORM for Node.js and TypeScript.
- **Docker:** A platform for developing, shipping, and running applications in isolated containers to ensure consistency across different environments.
#### Documentation

- **Postman:** Used for documentation and to provide a collection for API requests.

#### Version Control

- **Git:** A distributed version control system.
- **GitHub:** A web-based platform for version control and collaboration.

## How to Contribute

If you'd like to contribute to the project or have suggestions for improvement, please do not hesitate to make pull request.
