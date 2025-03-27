# Deployment Guide for SRPC Frontend: Locally and on AWS Amplify

## Local Deployment

### Prerequisites

Ensure you have the following installed:
- Node.js (version 12.18.3 or higher)
- npm (version 6.14.6 or higher)
- git

### Code Setup

**Clone the Repository**
To avoid entering credentials repeatedly, consider adding an SSH key to your GitHub account ([guide here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)).
Clone the repository with the following command:

```bash
git clone git@github.com:sunnypranay/SRPC_FRONT_END_PRIVATE.git
```

Navigate to the project directory:

```bash
cd SRPC_FRONT_END_PRIVATE
```

### Install Dependencies

**Install Project Dependencies**
This step installs all the necessary dependencies for the project:

```bash
npm install
```

### Run the App

**Start the Application**
This command starts the application on a local development server:

```bash
npm start
```

After running the command, your default web browser should open the application automatically. If it doesn't, you can manually open [http://localhost:3000](http://localhost:3000) to view it.

### Troubleshooting

If you encounter npm errors during the installation:
- Clear the npm cache with the command: `npm cache clean --force`.
- Then, reinstall the dependencies with `npm install`.

To check if you have the correct Node.js and npm versions, use:
- `node -v`
- `npm -v`

Make sure the versions meet the minimum requirements specified in the prerequisites.

## AWS Amplify Deployment

### Push Code to GitHub

**Push Your Changes to the Repository**

After making your changes, add, commit, and push them to your GitHub repository with these commands:

```bash
git add .
git commit -m "Your descriptive commit message"
git push origin main
```

### AWS Amplify Setup

**Set Up and Deploy Your App in AWS Amplify**

1. Navigate to the [AWS Amplify Console](https://us-east-2.console.aws.amazon.com/amplify/home?region=us-east-2#/).

2. Click on **New app**, then select **Host web app**.

3. You will be presented with several options. Choose **GitHub** as the source control service.

4. Connect your GitHub account by following the provided steps.

5. From the `Select a repository` dropdown, choose `SRPC_FRONT_END_PRIVATE` and for the branch, select `main`.

6. Review the default build settings. If everything looks correct, click on `Next`, then `Save and deploy`.

7. The deployment process has three phases: `Provision`, `Build`, and `Deploy`. It may take between 5 to 10 minutes.

8. Upon completion, you'll see a domain name provided by AWS Amplify (e.g., `https://main.d1q2w3e4r5t6y7.amplifyapp.com/`). Before adding a custom domain, verify that the site works as expected.

**Important**: The frontend should be deployed after the backend. Ensure the backend services are already deployed and operational before proceeding.

### Adding a Custom Domain

- On the left sidebar, click on `Domain management`.
- It will show you a default Domain name  such as `amplifyapp.com`. Click on `Add domain` on top right corner.
- In our case it is `uwmsrpc.org`. Enter the domain name and click on `Configure domain`.
- Then you will be prompted with new section below Subdomains.
    1. First option is `Root domain - https://uwmsrpc.org`. pointing to main branch of our repository.
    2. Second option is `Subdomain - https://www.uwmsrpc.org`. pointing to main branch of our repository.
    3. Leave the checkbox enabled for Setup redirect from https://uwmsrpc.org to https://www.uwmsrpc.org.
    4. Click on `Save`.
- You will be redirected to Domain managment setting page. where you can see the status of your domain such as `ssl creation`, `SSL Configuration`, `DNS Configuration`.
- During SSL configuration you will asked to verify you domain ownership by giving you to update DNS records in your domain provider.
    1. First one is to add `CNAME` record with name `_7758bad12fdc908d368c9cf9979a5297` and value `_587cf9b69271f2d9da2ec9cf9979a5297.ptsdsqfybm.acm-validations.aws.`
    to verfiy the domain ownership.
    2. Second one is to add `CNAME` record with name `www.` and value `d1q2w3e4r5t6y7.amplifyapp.com` to point to our application.

- _Note: The above CNAME are for example purposes please replace the with AWS provided CNAME values._

### Adding DNS Records in GoDaddy

- Log in to your GoDaddy account.

- In your list of domains, find the domain to add and choose DNS.

- On the DNS Management page, GoDaddy displays a list of records for your domain in the DNS Records section. You need to add two new CNAME records.

- Create the first CNAME record to point your subdomains to the Amplify domain.

    1. In the DNS Records section, choose Add.

    2. For Type, choose CNAME.

    3. For Name, enter only the subdomain. For example, if your subdomain is www.example.com, enter www for Name.

    4. For Value, look at your DNS records in the Amplify console and then enter the value. If the Amplify console displays the domain for your app as xxxxxxxxxxxxxx.cloudfront.net, enter xxxxxxxxxxxxxx.cloudfront.net for Value.

    5. Choose Add record.

- Create the second CNAME record to point to the AWS Certificate Manager (ACM) validation server. A single validated ACM generates an SSL/TLS certificate for your domain.

    1. For Type, choose CNAME.

    2. For Name, enter the subdomain.

    3. For example, if the DNS record in the Amplify console for verifying ownership of your subdomain is _c3e2d7eaf1e656b73f46cd6980fdc0e.example.com, enter only _c3e2d7eaf1e656b73f46cd6980fdc0e for Name.

    4. For Value, enter the ACM validation certificate.

    5. For example, if the validation server is _cjhwou20vhu2exampleuw20vuyb2ovb9.j9s73ucn9vy.acm-validations.aws, enter _cjhwou20vhu2exampleuw20vuyb2ovb9.j9s73ucn9vy.acm-validations.aws for Value.

    6. Choose Add record.

- _Note: The above CNAME are for example purposes please replace the with AWS provided CNAME values._

- After adding the CNAME records, you need to wait for the changes to propagate. 
- Go back to the domain management page in AWS Amplify the status of your domain should be `Available`.

- You can go the website by typing `https://www.uwmsrpc.org` in the browser.

# Current Issue with root domain
- Currently the root domain `https://uwmsrpc.org` is not working. It's because the domain is managed by GoDaddy and there is no option to add `ALIAS` record or `ANAME` record in GoDaddy. There is a option of `Forwarding` but it's not working with `https` protocol.
- Currently in discussion with AWS support team to resolve this issue.
