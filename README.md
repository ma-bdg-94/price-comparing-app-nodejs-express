
# The Price Comparator Tool

A simple for app for grocery price comparing, designed voluntarily for the citizens of Jemmel (Tunisia). This is the server part


## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)


## API Reference


### Authentication & User Management

#### Register new user & send SMS with secret number

```http
  POST /api/users/auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `fullName` | `string` | **Required**. User full name |
| `email` | `string` | **Required**. User email address |
| `phone` | `string` | **Required**. User phone number. must begin with `+216` |
| `password`| `string` | **Required**. User password. encrypted. min_length: `10` |
| `userType` | `string` | **Required**. User type. accepts values: `Admin`, `Customer`, `Farmer`, `Gross Vendor` and `Detail Vendor` |

#### Verify SMS secret number and Authentication

```http
  POST /api/users/auth/verifySMS
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `secretNumber`      | `number` | **Required**. Secret number sent in SMS |

#### Login user

```http
  POST /api/users/auth
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. User email address |
| `password`| `string` | **Required**. User password |

#### Refresh token

```http
  POST /api/users/auth/refresh
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `refreshTokenFromClient` | `string` | **Required** |
| `authorization`| `string` | **Required**. `Bearer JWT_ACCESS_TOKEN` |

#### Get authenticated user

```http
  GET /api/users/auth
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authorization`| `string` | **Required**. `Bearer JWT_ACCESS_TOKEN` |


### Screens management

#### Add new screen

```http
  POST /api/screens/auth
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authorization`| `string` | **Required**. `Bearer JWT_ACCESS_TOKEN` |