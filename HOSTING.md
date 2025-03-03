# Hosting Your Own Server

## Prerequisites

Before diving into the setup instructions, make sure you have the correct tools for the job. Hosting a dedicated server requires two things:

- SSH access to a VPS (or some other form of dedicated hosting)
- The ability to open ports on said machine

You can find cheap VPS hosts at [Ionos](https://www.ionos.com/), [A2 Hosting](https://www.a2hosting.com), or [Vultr](https://www.vultr.com/).

**NOTE:** I am not endorsing or recommending any of the following hosts, they are just a few I have found people to use.

If you accept the risk, you can host a dedicated server on your home network. However, you will need to [port forward](https://en.wikipedia.org/wiki/Port_forwarding) the necessary ports via your router for others to access your server. Do not do this unless you understand what you are doing. Previous Linux knowledge required.

## Setup

This tutorial is written assuming you are using [Ubuntu 20.04](https://ubuntu.com/). Follow accordingly based on the distribution you are using.

### Logging into the Machine

If you bought a VPS (or other form of hosting) from a hosting company, then these credentials should be accessible via their dashboard. Typically, they will consist of three things:

- **IP:** The IP of your server.
- **Username**: The username (usually root), to log in with.
- **Password:** The password to log in with.

Optionally, if your VPS provides SSH access on a different port, that will also be listed.

Open a terminal (Command Prompt for Windows) and write the following command:

```sh
ssh username@host
```

replacing username and host with your username and host.

If you have a custom SSH port (not 22), then use this instead:

```sh
ssh username@host -p port
```

additionally replacing port with the custom SSH port provided.

After writing this command, hit enter. You will be prompted for a password.

For security reasons, you cannot view your password as you type it. Type in the password, and hit enter.

If you see a notice notifying you of the machine you have just logged into, congratulations! You have successfully SSH'd into your server.

### Dependencies

Your setup requires a few dependencies:

- [Git](https://git-scm.com)
- [NGINX](https://nginx.org)
- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io)

If you are logged in as root, start by making sure sudo is installed:

```sh
apt -y install sudo
```

Then install git and nginx with the following command:

```sh
sudo apt -y install git nginx
```

To install Node.js, install the appropriate package from your distro, or for Ubuntu:

```sh
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&sudo apt-get install -y nodejs
```

And finally, install pnpm:

```sh
npm i -g pnpm
```

## Building Source

Clone your repository and navigate into it:

```sh
git clone https://github.com/NAMERIO/iogames.games
cd iogames.games
```

Install the necessary dependencies:

```sh
pnpm install
```

### Deploying Your Application

1. **Build the Application**:

   ```sh
   pnpm build
   ```

   This will generate a `dist` folder containing the production-ready files.

2. **Configure Nginx**:
   Create a new Nginx configuration file:

   ```sh
   sudo nano /etc/nginx/sites-available/iogames.games
   ```

   Add the following configuration:

   ```nginx
   server {
       listen 80;
       server_name your_domain_name www.your_domain_name;

       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg|otf|json)$ {
           expires 6M;
           access_log off;
           add_header Cache-Control "public";
       }
   }
   ```

   Create a symlink to activate the configuration:

   ```sh
   sudo ln -s /etc/nginx/sites-available/iogames.games /etc/nginx/sites-enabled/
   ```

   Test the Nginx configuration:

   ```sh
   sudo nginx -t
   ```

   Restart Nginx to apply changes:

   ```sh
   sudo systemctl restart nginx
   ```

3. **Enable HTTPS**:
   Install Certbot and set up HTTPS:

   ```sh
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your_domain_name -d www.your_domain_name
   ```

   Test automatic renewal:

   ```sh
   sudo certbot renew --dry-run
   ```

4. **Firebase Account Setup**
   Go to firebase console google auth and populate this file in src/firebaseConfig.ts to make account work.
   ```sh
   const firebaseConfig = {
    apiKey: "your_api_key",
    authDomain: "your_auth_domain",
    projectId: "your_project_id",
    storageBucket: "your_storage_bucket",
    messagingSenderId: "your_messaging_sender_id",
    appId: "your_app_id",
    measurementId: "your_measurement_id"
   };
   ```
5. **Restart Nginx if Needed**:
   ```sh
   sudo systemctl restart nginx
   ```

### Testing Your Setup

Visit your site:

- `http://your_domain_name`
- `https://your_domain_name`

## Steps to Update After File Changes on GitHub

Pull the Latest Changes from GitHub:

```
git pull origin main
```

Rebuild the Project for Production:

```
npm run build
```

Deploy the Updated Files to the Web Root: Copy the new build files to /var/www/html:

```
cp -r dist/* /var/www/html
```

Restart Nginx (if necessary): Restart Nginx if there are configuration or server-level changes (e.g., SSL or redirects):

```
sudo systemctl restart nginx
```

## Credits

This guide was inspired by [leia-uwu's survev HOSTING.md](https://github.com/leia-uwu/survev/blob/master/HOSTING.md).
