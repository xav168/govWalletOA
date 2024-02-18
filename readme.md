# GovTech OA

## Description
This is the codebase for my submission of the GovWallet & GovSupply take home assesment

## Assumptions
- The user should have the CSV files in the root folder
- This codebase only handles the backend logic of the task, it can be connected to a Frontend using the API reference below
- This codebase prioritizes conveniece. Certain endpoints like `POST /reset` are added in purely for the convinience of the tester.

## Features
- Perform lookup of representitive staff_pass_id against the mapping file 
- Verify if the team can redeem their gift by comparing the team name against past redemption in the redemption data
- Add new redemption to the redemption data if this team is still eligible for redemption, otherwise, do nothing and send the representative away
- Ability to reset the DB

## Installation
1. Clone the repository: `git clone https://github.com/xav168/govWalletOA.git`
2. Install dependencies: `npm install`
3. Setup the database connection: `npx prisma migrate dev --name init`
4. Add the CSV files to the root folder
5. Configure the environment variables: Create a `.env` file and set the required variables. You need to add `DATABASE_URL="file:./dev.db"`
6. Start the application: `npm run dev` you should see a log on the console stating that the server is running.
7. Test the application: `npm test` runs the test suite in the __tests__ folder. Alternatively you can test a live version by sending requests to the server via postman

## Quick Start
- This application loads the content from the CSV file onto a local MySQL database. After installing the required files, you would first need to load the data from the csv into the database by calling the `POST /staff/init` route. 
- After initializing the staff database, you can check details of the staff by using the `GET /staff` request. It should return a JSON object containing details of the staff
- Check if the staff is eligible to redeem the gift for their team by using the `GET /redemptionstatus` request. It would return a JSON object with the key can_redeem indicating if the staff is eligible for redemption or not. Note that this does not redeem the gift.
- Redeem the gift using the `POST /redeem` request. This redeems the gift for the staff's team.

## API

### Get Staff Details
This endpoint takes in a `staff_pass_id` and returns a JSON object containing the details of the staff associated with the `staff_pass_id`.

**URL** : `/staff`

**Method** : `GET`

**Query Parameters** : 

| Name | Type    | Description                      |
|------|---------|----------------------------------|
| `staff_pass_id` | `string` | **Required**. The ID of the staff member. |

**Success Response** : 

**Code** : `200 OK`

**Content example** :
```json
{
    "staff_pass_id": "123",
    "team_name": "team1",
    "created_at": "2022-01-01T00:00:00.000Z"
}
```

**Error Response** :

**Code** : `400 Bad Request`

**Content** : `"No User Found"`


### Initialize Staff Database


This endpoint reads a CSV file from the server's file system and initializes the staff database with the data from the CSV file. The CSV file should have columns for `staff_pass_id`, `team_name`, and `created_at`, and the first line of the file is assumed to be a header line.

**URL** : `/staff/init`

**Method** : `POST`

**Query Parameters** : 

| Name | Type | Description |
|------|------|-------------|
| `file_name` | `string` | **Required**. The name of the CSV file to initialize the database from. |

**Success Response** : 

**Code** : `200 OK`

**Content** : `"Successfully Initialized DB"`




### Redeem Gift
This endpoint takes in a `staff_pass_id` and redeems a gift for their team.

**URL** : `/redeem`

**Method** : `POST`

**Query Parameters** : 

| Name | Type | Description |
|------|------|-------------|
| `staff_pass_id` | `string` | **Required**. The ID of the staff member. |

**Success Response** : 

**Code** : `200 OK`

**Content example**

```json
{
    "team_name": "team1",
    "redeemed_by": "123",
    "redeemed_at": "2022-01-01T00:00:00.000Z"
}
```

**Error Response** :

**Code** : `400 Bad Request`

**Content** : `"No User Found"` or `"Gift has already been redeemed"`

### Check Team Redemption

This endpoint takes in a `staff_pass_id`, and checks if the staff associated with that `staff_pass_id` is eligible to redeem a gift for their team. 
**URL** : `/redemptionstatus`

**Method** : `GET`

**Query Parameters** : 

| Name | Type | Description |
|------|------|-------------|
| `staff_pass_id` | `string` | **Required**. The ID of the staff member. |

**Success Response** : 

**Code** : `200 OK`

**Content example**

```json
{
    "can_redeem": true
}
```

**Error Response** :

**Code** : `400 Bad Request`

**Content** : `"No User Found"`

### Reset Database
This endpoint clears the stored database.

**URL** : `/reset`

**Method** : `POST`


**Success Response** : 

**Code** : `200 OK`