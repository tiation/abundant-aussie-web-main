# Complete Beginner's Guide to GitHub Setup

This guide assumes you have **never used GitHub or any development tools before**. We'll walk through everything step by step.

## What You'll Need

- A computer (Windows, Mac, or Linux)
- An internet connection
- An email address

## Step 1: Create a GitHub Account

1. **Go to GitHub**
   - Open your web browser
   - Navigate to [https://github.com](https://github.com)

2. **Sign Up**
   - Click the green "Sign up" button
   - Enter your email address
   - Create a password (make it strong!)
   - Choose a username (this will be public)
   - Verify you're human with the puzzle
   - Click "Create account"

3. **Verify Your Email**
   - Check your email inbox
   - Click the verification link GitHub sent you

## Step 2: Install Required Software

### Install Node.js and npm

**For Windows:**
1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the "LTS" version (recommended)
3. Run the installer and follow the prompts
4. Accept all default settings

**For Mac:**
1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the "LTS" version
3. Open the downloaded file and follow the installer
4. Or use Homebrew if you have it: `brew install node`

**For Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm
```

### Install Git

**For Windows:**
1. Go to [https://git-scm.com/download/windows](https://git-scm.com/download/windows)
2. Download and run the installer
3. Use all default settings during installation

**For Mac:**
Git is usually pre-installed. To check, open Terminal and type:
```bash
git --version
```
If not installed, install via Homebrew: `brew install git`

**For Linux:**
```bash
sudo apt update
sudo apt install git
```

### Install GitHub CLI (Optional but Recommended)

**For Windows:**
1. Download from [https://cli.github.com/](https://cli.github.com/)
2. Run the installer

**For Mac:**
```bash
brew install gh
```

**For Linux:**
```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

## Step 3: Configure Git

1. **Open Terminal/Command Prompt**
   - **Windows:** Press Win+R, type `cmd`, press Enter
   - **Mac:** Press Cmd+Space, type "Terminal", press Enter
   - **Linux:** Press Ctrl+Alt+T

2. **Set Your Identity**
   Replace "Your Name" and "your.email@example.com" with your actual information:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Authenticate with GitHub**
   ```bash
   gh auth login
   ```
   - Choose "GitHub.com"
   - Choose "HTTPS"
   - Choose "Login with a web browser"
   - Copy the code shown and press Enter
   - Your browser will open - paste the code and login

## Step 4: Fork This Repository

1. **Go to the Project Page**
   - Navigate to: [https://github.com/USERNAME/caleb-stands-strong-web](https://github.com/USERNAME/caleb-stands-strong-web)
   - (Replace USERNAME with the actual repository owner)

2. **Fork the Repository**
   - Click the "Fork" button in the top-right corner
   - Choose your account as the destination
   - Wait for the fork to complete

## Step 5: Clone Your Fork

1. **Get the Clone URL**
   - On your forked repository page
   - Click the green "Code" button
   - Copy the HTTPS URL

2. **Clone to Your Computer**
   In your terminal, navigate to where you want the project folder:
   ```bash
   cd Desktop  # or wherever you want to put the project
   git clone https://github.com/YOUR-USERNAME/caleb-stands-strong-web.git
   cd caleb-stands-strong-web
   ```

## Step 6: Install Project Dependencies

```bash
npm install
```

This might take a few minutes as it downloads all the required packages.

## Step 7: Run the Project Locally

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **View Your Site**
   - Open your web browser
   - Go to `http://localhost:5173` (or the URL shown in your terminal)
   - You should see the website running!

## What's Next?

Now you have the project running locally! Here are your next steps:

1. **Make Changes** - Edit files in the `src` folder
2. **Deploy to Vercel** - Follow our [Vercel deployment guide](vercel-setup.md)
3. **Set up GitHub Pages** - Follow our [GitHub Pages guide](github-pages-setup.md)

## Getting Help

- **Stuck?** Check our [Common Issues](common-issues.md) page
- **Need more help?** Create an issue in the GitHub repository
- **Want to learn more?** Check out [GitHub's own tutorials](https://guides.github.com/)

## Important Commands to Remember

```bash
# Check if git is installed
git --version

# Check if Node.js and npm are installed
node --version
npm --version

# Install project dependencies
npm install

# Run the development server
npm run dev

# Check git status
git status

# Add changes to staging
git add .

# Commit changes
git commit -m "Your commit message"

# Push changes to GitHub
git push
```

**Tip:** Keep this guide bookmarked - you'll refer to it often when starting out!
