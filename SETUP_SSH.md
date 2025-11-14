# SSH Setup for lotionr/finapp Repository

## Current Situation
- Your SSH key is authenticated as: **FlamaLlamas**
- Target repository: **lotionr/finapp**
- Issue: SSH key needs to be added to the lotionr GitHub account

## Solution Options

### Option 1: Add Existing SSH Key to lotionr Account (Recommended)

1. **Copy your public SSH key:**
   ```bash
   pbcopy < ~/.ssh/id_ed25519.pub
   ```
   Or view it:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

2. **Add to lotionr GitHub account:**
   - Go to: https://github.com/settings/keys (while logged in as lotionr)
   - Click "New SSH key"
   - Title: "MacBook Pro" (or any name)
   - Key: Paste the key (Cmd+V)
   - Click "Add SSH key"

3. **Test connection:**
   ```bash
   ssh -T git@github.com
   ```
   Should show: "Hi lotionr! You've successfully authenticated..."

### Option 2: Generate New SSH Key for lotionr Account

If you want a separate key for lotionr:

```bash
# Generate new key
ssh-keygen -t ed25519 -C "lotionr@github" -f ~/.ssh/id_ed25519_lotionr

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_lotionr

# Copy public key
pbcopy < ~/.ssh/id_ed25519_lotionr.pub
```

Then add this key to lotionr GitHub account.

### Option 3: Use SSH Config for Multiple Accounts

Create/edit `~/.ssh/config`:

```
# FlamaLlamas account
Host github.com-flamallamas
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519

# lotionr account
Host github.com-lotionr
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_lotionr
```

Then use:
```bash
git remote set-url origin git@github.com-lotionr:lotionr/finapp.git
```

## After Setup

Once SSH is configured for lotionr:

```bash
cd /Users/narenb/dev/lochan-projects/newproj
git init
git remote add origin git@github.com:lotionr/finapp.git
git add .
git commit -m "Initial commit"
git push -u origin main
```
