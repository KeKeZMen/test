from scapy.all import Packet, Raw, sniff
from scapy.layers.inet import TCP, IP


def process_packet(packet: Packet):
  if packet.haslayer(TCP) and packet.haslayer(Raw) and packet.haslayer(IP):
      if packet[TCP].dport == 80 or packet[TCP].sport == 80:
          load = packet[Raw].load
          print("[+] HTTP Packet found!")
          print("[+] Data: ", load)


def main():
  sniff(filter="tcp and port 80", prn=process_packet, store=0, iface="Realtek Gaming GbE Family Controller")


if __name__ == "__main__":
  main()