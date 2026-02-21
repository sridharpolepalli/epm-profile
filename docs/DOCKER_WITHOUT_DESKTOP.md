# Install Docker without Desktop on Windows

This document structures the content from the ChatGPT shared conversation **"Install Docker without Desktop"** into topics, sub-topics, and FAQ. Use it as a quick reference; for the full step-by-step conversation, see the source below.

**Source:** [ChatGPT – Install Docker without Desktop](https://chatgpt.com/share/69998edb-55dc-800c-a616-97aee468144b)

---

## 1. Topics and sub-topics

### 1.1 Why install Docker without Desktop?

- **Licensing:** Docker Desktop has licensing terms for some organizations (e.g. large companies). Using Docker Engine in WSL2 avoids that.
- **Resource use:** Running only Docker Engine in WSL2 can use fewer resources than Docker Desktop.
- **Control:** You manage Docker Engine and WSL directly instead of the Desktop GUI.

### 1.2 Prerequisites

- **Windows:** Windows 10 (version 2004+) or Windows 11 (64-bit).
- **WSL2:** Windows Subsystem for Linux 2 must be supported and enabled.
- **Linux distro:** A WSL2 distribution (e.g. Ubuntu 22.04 or 24.04) installed.
- **Rights:** Administrator access for enabling features and installing software.

### 1.3 Enable WSL2

- **Enable WSL:** Turn on the *Microsoft-Windows-Subsystem-Linux* feature.
- **Enable Virtual Machine Platform:** Required for WSL2.
- **Set WSL2 as default:** So new distros use WSL2.
- **Restart:** Reboot after enabling features.

### 1.4 Install a Linux distribution

- **Choose a distro:** Ubuntu (e.g. 22.04 or 24.04 LTS) is commonly used.
- **Install from Store:** Install from Microsoft Store or use `wsl --install -d Ubuntu-24.04`.
- **First run:** Complete initial setup (username and password) inside the distro.

### 1.5 Install Docker Engine inside WSL2

- **Update packages:** Run `apt-get update` (and ensure `curl`, `ca-certificates`, `gnupg`, `lsb-release` are installed).
- **Add Docker’s GPG key and repo:** Add Docker’s official APT repository for your distro (e.g. Ubuntu).
- **Install Docker:** Install `docker-ce`, `docker-ce-cli`, `containerd.io`, and optionally `docker-buildx-plugin` and `docker-compose-plugin`.
- **Add user to `docker` group:** So you can run `docker` without `sudo` (e.g. `usermod -aG docker $USER`).
- **Restart WSL or log out/in:** So group membership and Docker daemon work correctly.

### 1.6 Start and use Docker from WSL

- **Start the daemon:** Start the Docker daemon inside WSL (e.g. `sudo service docker start` or with systemd if enabled).
- **Run from WSL terminal:** Use `docker` and `docker compose` from the WSL (e.g. Ubuntu) shell.
- **Auto-start (optional):** Use `systemd` in WSL or a script so the Docker daemon starts when WSL starts.

### 1.7 Use Docker from Windows (PowerShell/CMD)

- **Proxy scripts:** Create small `.cmd` or PowerShell scripts on Windows that call `wsl docker ...` and `wsl docker compose ...`.
- **Add to PATH:** Put those scripts in a folder and add that folder to the Windows user PATH so you can run `docker` and `docker compose` from PowerShell or CMD.
- **Limitation:** Docker runs inside WSL; Windows only forwards commands. File paths and networking are from the WSL side.

### 1.8 Verify installation

- **Docker version:** Run `docker --version` (from WSL or via proxy from Windows).
- **Docker Compose:** Run `docker compose version` (or `docker-compose --version` if using the older binary).
- **Test run:** Run `docker run hello-world` to confirm the daemon works and can pull images.

### 1.9 Troubleshooting

- **WSL2 not available:** Ensure Windows is updated and virtualization is enabled in BIOS/UEFI.
- **Docker daemon not running:** Start it inside WSL (e.g. `sudo service docker start`) or enable systemd.
- **Permission denied:** Ensure your user is in the `docker` group and you’ve logged out and back in (or restarted WSL).
- **Networking issues:** Check WSL2 network mode and firewall; localhost in WSL can differ from Windows.

---

## 2. FAQ

**Q1. Do I need Docker Desktop to use Docker on Windows?**  
No. You can install Docker Engine inside WSL2 and use it from the WSL terminal or from Windows via scripts that call `wsl docker ...`. See the [source conversation](https://chatgpt.com/share/69998edb-55dc-800c-a616-97aee468144b) for steps.

**Q2. What is WSL2 and why is it required?**  
WSL2 is the Windows Subsystem for Linux, version 2. It provides a real Linux kernel in a lightweight VM. Docker Engine is a Linux program, so it runs inside this Linux environment. WSL1 does not support the same kernel features Docker needs.

**Q3. Can I use Docker from Windows PowerShell after installing Docker in WSL?**  
Yes, by creating small wrapper scripts (e.g. `.cmd` or `.ps1`) that run `wsl docker %*` and adding their folder to your Windows PATH. Then you can type `docker` and `docker compose` from PowerShell or CMD; the commands run inside WSL.

**Q4. How do I start the Docker daemon when I open WSL?**  
You can start it manually with `sudo service docker start`. For automatic start, enable systemd in WSL (e.g. add `[boot]` / `systemd=true` in `/etc/wsl.conf`) and ensure the Docker service is enabled, or add a startup script that starts Docker.

**Q5. Where are Docker images and containers stored?**  
Inside the WSL2 Linux filesystem (e.g. under `/var/lib/docker` in the distro). They are not stored on the Windows C: drive by default. Back up important data accordingly.

**Q6. Does this setup work with Docker Compose?**  
Yes. Install the `docker-compose-plugin` (Docker Compose V2) in WSL and use `docker compose` (with a space). You can also expose it from Windows via a proxy script that runs `wsl docker compose ...`.

**Q7. What if my company blocks Docker Desktop?**  
Using Docker Engine in WSL2 avoids Docker Desktop entirely and its licensing. You only use Microsoft WSL and the official Docker Engine packages from Docker’s repository. Confirm with your IT or legal team that this approach is allowed.

**Q8. How do I update Docker after installing it in WSL?**  
Use your distro’s package manager, e.g. `sudo apt-get update && sudo apt-get upgrade` for Ubuntu. Docker Engine and Compose plugin will update with the rest of the system packages if you installed them from Docker’s APT repository.

**Q9. Can I use the same `docker run` and `docker compose` commands as on Linux?**  
Yes. From the WSL terminal, usage is the same as on a native Linux machine. When calling Docker from Windows via `wsl docker ...`, path and environment differences may apply (e.g. use WSL paths or ensure paths are passed correctly into WSL).

**Q10. Where can I see the full step-by-step instructions?**  
In the ChatGPT shared conversation: [Install Docker without Desktop](https://chatgpt.com/share/69998edb-55dc-800c-a616-97aee468144b). This document is a structured summary (topics, sub-topics, FAQ) derived from that content.

---

## 3. Quick reference (typical steps)

| Step | Action |
|------|--------|
| 1 | Enable WSL and Virtual Machine Platform; set WSL2 as default; restart. |
| 2 | Install a WSL2 distro (e.g. Ubuntu from Store or `wsl --install -d Ubuntu-24.04`). |
| 3 | Inside WSL: add Docker’s repo, install Docker Engine and Compose plugin, add user to `docker` group. |
| 4 | Restart WSL or log out/in; start Docker (e.g. `sudo service docker start`). |
| 5 | (Optional) Create Windows scripts that run `wsl docker %*` and `wsl docker compose %*` and add them to PATH. |
| 6 | Verify with `docker --version`, `docker compose version`, and `docker run hello-world`. |

---

*Source: [ChatGPT – Install Docker without Desktop](https://chatgpt.com/share/69998edb-55dc-800c-a616-97aee468144b)*
