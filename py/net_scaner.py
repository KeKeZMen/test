import scapy.all as scapy

def scan(ip):
    arp_req = scapy.ARP(pdst=ip)
    broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
    app_req_broadcast = broadcast/arp_req
    answered_list = scapy.srp(app_req_broadcast, timeout=1)[0]

    print("\nIP\t\t\tMac\n-----------------------------------------")
    for el in answered_list:
        print(f'{el[1].psrc}\t\t{el[1].hwsrc}')

def main():
    try:
        target_ip = input("Target IP / IPs: ")
        scan(target_ip)
    except KeyboardInterrupt:
        print("[-] CTRL + C")

if __name__ == "__main__":
    main()