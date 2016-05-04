# Samsung Smart TV APIs and more
Below you can find the findings of an inspection of the network traffic of the Samsung Smart View iPhone app. I have listed everything that might be useful for you. However, some of it can be specific for the model or the firmware I use.

Model: UE46F6500

Year: 2013

*If you get annoying "service X will be discontinued in 2 weeks" messages everytime you turn on your tv, you probably have the right model ;)*

The information below contains some user specific information (user agents, ip addresses, tv content etc.), you can of course just ignore that. Also, it is primarily focused on getting information, if you are looking for information on how to control your TV, take a look at [this topic](http://forum.samygo.tv/viewtopic.php?f=12&t=1792).

TODO:
* Check https://www.informatik.tu-darmstadt.de/fileadmin/user_upload/Group_SIT/Publications/Thesis/jmuller_msc_final.pdf, appendix, for more SOAP functions. Might be something useful there.

If you think I missed anything or did some other findings, please [contact me](https://casperboone.nl/) or just make the changes yourself and create a pull request.

## Soap 'API'

### (Sources) GetMBRDeviceList

Request
```
POST /smp_4_ HTTP/1.0
HOST: 192.168.1.126:7676
CONTENT-LENGTH: 246
CONTENT-TYPE: text/xml;charset="utf-8"
USER-AGENT: DLNADOC/1.50 SEC_HHP_iPhone van Casper/1.0
SOAPACTION: "urn:samsung.com:service:MainTVAgent2:1#GetMBRDeviceList"

<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:GetMBRDeviceList xmlns:u="urn:samsung.com:service:MainTVAgent2:1"></u:GetMBRDeviceList></s:Body></s:Envelope>
```

Response
```xml
<?xml
    version="1.0"
    encoding="utf-8"
    ?>    
<s:Envelope
    xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
    s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <s:Body>
        <u:GetMBRDeviceListResponse
            xmlns:u="urn:samsung.com:service:MainTVAgent2:1">
            <Result>
                OK
                </Result>
            <MBRDeviceList>
                 &lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&gt;&lt;MBRDeviceList&gt;&lt;MBRDevice&gt;&lt;ActivityIndex&gt;0&lt;/ActivityIndex&gt;&lt;SourceType&gt;HDMI1&lt;/SourceType&gt;&lt;ID&gt;57&lt;/ID&gt;&lt;DeviceType&gt;STB&lt;/DeviceType&gt;&lt;BrandName&gt;UPC&lt;/BrandName&gt;&lt;ModelNumber&gt;&lt;/ModelNumber&gt;&lt;/MBRDevice&gt;&lt;MBRDevice&gt;&lt;ActivityIndex&gt;1&lt;/ActivityIndex&gt;&lt;SourceType&gt;HDMI2&lt;/SourceType&gt;&lt;ID&gt;58&lt;/ID&gt;&lt;DeviceType&gt;HTS&lt;/DeviceType&gt;&lt;BrandName&gt;Apple&lt;/BrandName&gt;&lt;ModelNumber&gt;&lt;/ModelNumber&gt;&lt;/MBRDevice&gt;&lt;/MBRDeviceList&gt;
            </MBRDeviceList>
            </u:GetMBRDeviceListResponse>
        </s:Body>
    </s:Envelope>
```

### (Current Source status) GetCurrentExternalSource
*Might look differently when not currently showing an external source. TODO: Check this.*

Request
```
POST /smp_4_ HTTP/1.0
HOST: 192.168.1.126:7676
CONTENT-LENGTH: 262
CONTENT-TYPE: text/xml;charset="utf-8"
USER-AGENT: DLNADOC/1.50 SEC_HHP_iPhone van Casper/1.0
SOAPACTION: "urn:samsung.com:service:MainTVAgent2:1#GetCurrentExternalSource"

<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:GetCurrentExternalSource xmlns:u="urn:samsung.com:service:MainTVAgent2:1"></u:GetCurrentExternalSource></s:Body></s:Envelope>
```

Response
```xml
<?xml
    version="1.0"
    encoding="utf-8"
    ?>
<s:Envelope
    xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
    s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <s:Body>
        <u:GetCurrentExternalSourceResponse
            xmlns:u="urn:samsung.com:service:MainTVAgent2:1">
            <Result>
                OK
                </Result>
            <CurrentExternalSource>
                HDMI1
                </CurrentExternalSource>
            <ID>
                57
                </ID>
            <CurrentMBRActivityIndex>
                0
                </CurrentMBRActivityIndex>
            </u:GetCurrentExternalSourceResponse>
        </s:Body>
    </s:Envelope>
```

### (DTV Information) GetDTVInformationResponse
Request
```
POST /smp_4_ HTTP/1.0
HOST: 192.168.1.126:7676
CONTENT-LENGTH: 248
CONTENT-TYPE: text/xml;charset="utf-8"
USER-AGENT: DLNADOC/1.50 SEC_HHP_iPhone van Casper/1.0
SOAPACTION: "urn:samsung.com:service:MainTVAgent2:1#GetDTVInformation"

<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:GetDTVInformation xmlns:u="urn:samsung.com:service:MainTVAgent2:1"></u:GetDTVInformation></s:Body></s:Envelope>
```

Response
```xml
<?xml
    version="1.0"
    encoding="utf-8"
    ?>
<s:Envelope
    xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
    s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <s:Body>
        <u:GetDTVInformationResponse
            xmlns:u="urn:samsung.com:service:MainTVAgent2:1">
            <Result>
                OK
                </Result>
            <DTVInformation>
                    &lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&gt;&lt;DTVInformation&gt;&lt;SupportTVVersion&gt;2013&lt;/SupportTVVersion&gt;&lt;SupportGetAvailableActions&gt;Yes&lt;/SupportGetAvailableActions&gt;&lt;SupportBluetooth&gt;Yes&lt;/SupportBluetooth&gt;&lt;TargetLocation&gt;&lt;/TargetLocation&gt;&lt;SupportAntMode&gt;1,2,3&lt;/SupportAntMode&gt;&lt;SupportChSort&gt;Yes&lt;/SupportChSort&gt;&lt;SupportChannelLock&gt;Yes&lt;/SupportChannelLock&gt;&lt;SupportChannelInfo&gt;Yes&lt;/SupportChannelInfo&gt;&lt;SupportChannelDelete&gt;No&lt;/SupportChannelDelete&gt;&lt;SupportEditNumMode&gt;&lt;EditNumMode&gt;&lt;NumMode&gt;ANALOG_INSERT&lt;/NumMode&gt;&lt;MinValue&gt;0&lt;/MinValue&gt;&lt;MaxValue&gt;99&lt;/MaxValue&gt;&lt;/EditNumMode&gt;&lt;/SupportEditNumMode&gt;&lt;SupportRegionalVariant&gt;No&lt;/SupportRegionalVariant&gt;&lt;SupportPVR&gt;Yes&lt;/SupportPVR&gt;&lt;NumberOfRecord&gt;1&lt;/NumberOfRecord&gt;&lt;SupportDTV&gt;Yes&lt;/SupportDTV&gt;&lt;SupportStream&gt;&lt;Container&gt;MPEG2&lt;/Container&gt;&lt;VideoFormat&gt;H.264&lt;/VideoFormat&gt;&lt;AudioFormat&gt;MP3&lt;/AudioFormat&gt;&lt;XResolution&gt;720&lt;/XResolution&gt;&lt;YResolution&gt;480&lt;/YResolution&gt;&lt;AudioSamplingRate&gt;48000&lt;/AudioSamplingRate&gt;&lt;AudioChannels&gt;2&lt;/AudioChannels&gt;&lt;/SupportStream&gt;&lt;SupportDRMType&gt;HDCP,PrivateTZ&lt;/SupportDRMType&gt;&lt;SupportGUICloneView&gt;Yes&lt;/SupportGUICloneView&gt;&lt;/DTVInformation&gt;
                    </DTVInformation>
            </u:GetDTVInformationResponse>
        </s:Body>
    </s:Envelope>
```

### (List All Sources) GetSourceListResponse
Lists all sources, including not active / not connected sources.

Request
```
POST /smp_4_ HTTP/1.0
HOST: 192.168.1.126:7676
CONTENT-LENGTH: 240
CONTENT-TYPE: text/xml;charset="utf-8"
USER-AGENT: DLNADOC/1.50 SEC_HHP_iPhone van Casper/1.0
SOAPACTION: "urn:samsung.com:service:MainTVAgent2:1#GetSourceList"

<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:GetSourceList xmlns:u="urn:samsung.com:service:MainTVAgent2:1"></u:GetSourceList></s:Body></s:Envelope>
```

Response
```xml
<?xml
    version="1.0"
    encoding="utf-8"
    ?>
<s:Envelope
    xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
    s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <s:Body>
        <u:GetSourceListResponse
            xmlns:u="urn:samsung.com:service:MainTVAgent2:1">
            <Result>
                OK
                </Result>
            <SourceList>
                    [truncated]&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&gt;&lt;SourceList&gt;&lt;CurrentSourceType&gt;HDMI1&lt;/CurrentSourceType&gt;&lt;ID&gt;57&lt;/ID&gt;&lt;Source&gt;&lt;SourceType&gt;TV&lt;/SourceType&gt;&lt;ID&gt;0&
                </SourceList>
            </u:GetSourceListResponse>
        </s:Body>
    </s:Envelope>
```

### (???) GetBannerInformationResponse
No idea what this is.

```xml
<?xml
    version="1.0"
    encoding="utf-8"
    ?>
<s:Envelope
    xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
    s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <s:Body>
        <u:GetBannerInformationResponse
            xmlns:u="urn:samsung.com:service:MainTVAgent2:1">
            <Result>
                NOTOK_NotStreaming
                </Result>
            </u:GetBannerInformationResponse>
        </s:Body>
    </s:Envelope>
```

### (Channel List Type) GetChannelListUrlResponse
Specifies the type of channel list. Does not give enough information to actually do something with it I guess.

Request
```
POST /smp_4_ HTTP/1.0
HOST: 192.168.1.126:7676
CONTENT-LENGTH: 248
CONTENT-TYPE: text/xml;charset="utf-8"
USER-AGENT: DLNADOC/1.50 SEC_HHP_iPhone van Casper/1.0
SOAPACTION: "urn:samsung.com:service:MainTVAgent2:1#GetChannelListURL"

<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:GetChannelListURL xmlns:u="urn:samsung.com:service:MainTVAgent2:1"></u:GetChannelListURL></s:Body></s:Envelope>
```

Response
```xml
<?xml
    version="1.0"
    encoding="utf-8"
    ?>
<s:Envelope
    xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
    s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <s:Body>
        <u:GetChannelListURLResponse
            xmlns:u="urn:samsung.com:service:MainTVAgent2:1">
            <Result>
                OK
                </Result>
            <ChannelListVersion>
                7
                </ChannelListVersion>
            <SupportChannelList>
                    [xml.cdata == "&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&gt;&lt;SupportChannelList&gt;&lt;ChListInfo&gt;&lt;ChListType&gt;0x01&lt;/ChListType&gt;&lt;Sort&gt;Number&lt;/Sort&gt;&lt;/ChListInfo&gt;&lt;ChListInfo&gt;&lt;ChListType&gt;0x03&lt;/ChListType&gt;&lt;Sort&gt;Number&lt;/Sort&gt;&lt;/ChListInfo&gt;&lt;ChListInfo&gt;&lt;ChListType&gt;0x04&lt;/ChListType&gt;&lt;Sort&gt;Number&lt;/Sort&gt;&lt;/ChListInfo&gt;&lt;/SupportChannelList&gt;"
            </SupportChannelList>
            <ChannelListURL>
                http://192.168.1.126:9090/BinaryBlob/1/ChannelList.dat
                </ChannelListURL>
            <ChannelListType>
                0x01
                </ChannelListType>
            <Sort>
                Number
                </Sort>
            </u:GetChannelListURLResponse>
        </s:Body>
    </s:Envelope>

```

### (Set Source) SetMainTVSource
Set TV to a different input.

Request
```
POST /smp_4_ HTTP/1.0
HOST: 192.168.1.126:7676
CONTENT-LENGTH: 292
CONTENT-TYPE: text/xml;charset="utf-8"
USER-AGENT: DLNADOC/1.50 SEC_HHP_iPhone van Casper/1.0
SOAPACTION: "urn:samsung.com:service:MainTVAgent2:1#SetMainTVSource"

<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:SetMainTVSource xmlns:u="urn:samsung.com:service:MainTVAgent2:1"><Source>HDMI2</Source><ID>58</ID><UiID>-1</UiID></u:SetMainTVSource></s:Body></s:Envelope>
```
Response
```xml
<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <s:Body>
        <u:SetMainTVSourceResponse xmlns:u="urn:samsung.com:service:MainTVAgent2:1">
            <Result>OK</Result>
        </u:SetMainTVSourceResponse>

    </s:Body>

</s:Envelope>
```

## zeus-admin (port 9090)

### Channel List
(see also GetChannelListUrlResponse of the Soap API)

Request
```
GET /BinaryBlob/1/ChannelList.dat HTTP/1.0
Host: 192.168.1.126:9090
Accept: */*
Connection: close
```

Raw DAT file
```
O˛ˇÊ…Kˇˇ1ƒNPO 1 HD2˛ˇÊ Kˇˇ2ƒNPO 2 HD2˛ˇÊÕKˇˇ3ƒNPO 3 HD2˛ˇ Lˇˇ4ÃRTL 4 HD5˛ˇ Lˇˇ5ÃRTL 5 HD5˛ˇ„Kˇˇ6ÃSBS6 HD˛ˇ‚ÌJˇˇ7ÃRTL 7 HD@˛ˇÓÚKˇˇ8ÃVeronica HD / Disney XD4	˛ˇÃPJˇˇ9ÃNet5 HD
˛ˇÏﬁKˇˇ10ÃRTL 8 HD3˛ˇÀkLˇˇ11ÃFOX HD:˛ˇ‚˜Jˇˇ12ÃRTL Z HD@
[omitted]
```

You might want to look into it at a deeper level:
```
00000000  aa 02 4f 01 04 00 01 00  fe ff e6 00 c9 4b ff ff  |..O..........K..|
00000010  31 00 00 00 00 00 00 00  00 c4 08 00 4e 50 4f 20  |1...........NPO |
00000020  31 20 48 44 00 00 00 00  00 00 00 00 00 00 00 00  |1 HD............|
00000030  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000070  00 00 00 00 00 32 08 00  00 00 00 00 00 00 00 00  |.....2..........|
00000080  04 00 02 00 fe ff e6 00  ca 4b ff ff 32 00 00 00  |.........K..2...|
00000090  00 00 00 00 00 c4 08 00  4e 50 4f 20 32 20 48 44  |........NPO 2 HD|
000000a0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
000000f0  00 32 08 00 00 00 00 00  00 00 00 00 04 00 03 00  |.2..............|
00000100  fe ff e6 00 cd 4b ff ff  33 00 00 00 00 00 00 00  |.....K..3.......|
00000110  00 c4 08 00 4e 50 4f 20  33 20 48 44 00 00 00 00  |....NPO 3 HD....|
00000120  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
[omitted]
```

Not really my field of expertise, but I found that:
* All entries are seperated by (00 00 00 00 00 00 00 00 00) 04. Most of them with 08 00 00 00 00 00 00 00 00 00 04 actually, but there were a few exceptions (mostly local tv channel, but that might just be a coincedence)
* 11 bytes after this (00...00 04), you can find the channel number. Note that the channel number does not have leading zeroes.
* 23 bytes after this (00...00 04), you can find the channel name. Ended by
* The first 4 bytes contain (not repeated) unknown information.

## UPNP

### Get Device Information

GET IP:7676/smp_2_

Response
```xml
<?xml version="1.0"?>
<root xmlns="urn:schemas-upnp-org:device-1-0" xmlns:sec="http://www.sec.co.kr/dlna">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <device>
    <deviceType>urn:samsung.com:device:MainTVServer2:1</deviceType>
    <friendlyName>[TV]Samsung LED46</friendlyName>
    <manufacturer>Samsung Electronics</manufacturer>
    <manufacturerURL>http://www.samsung.com</manufacturerURL>
    <modelDescription>Samsung DTV MainTVServer2</modelDescription>
    <modelName>UE46F6500</modelName>
    <modelNumber>1.0</modelNumber>
    <modelURL>http://www.samsung.com</modelURL>
    <serialNumber>20100***</serialNumber>
    <UDN>uuid:0db58580-00e6-1000-851e-5056bf0*****</UDN>
    <UPC>1234567890**</UPC>
    <sec:deviceID>CPCAVXASBB***</sec:deviceID>
    <sec:ProductCap>Browser,Y2013</sec:ProductCap>
    <serviceList>
      <service>
        <serviceType>urn:samsung.com:service:MainTVAgent2:1</serviceType>
        <serviceId>urn:samsung.com:serviceId:MainTVAgent2</serviceId>
		<controlURL>/smp_4_</controlURL>
        <eventSubURL>/smp_5_</eventSubURL>
		<SCPDURL>/smp_3_</SCPDURL>
      </service>
</serviceList>
</device>
</root>
```
