import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  processColor,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RadarChart} from 'react-native-charts-wrapper';
import {parseISO, format} from 'date-fns';

import {colors} from '../../styles';
import api from '../../services/api';
import { Laoding, NotFound } from '../../components';
import { Entypo } from 'react-native-vector-icons';
const {width, height} = Dimensions.get('window');

const radar = ({navigation, route}) => {
  const { radar } = useSelector((store) => store.radar);
  const [data, setData] = useState();
  const [lastIntensity, setLastIntensity] = useState();
  const [instantCard, setInstantCard] = useState();
  const [tideTable, setTideTable] = useState();
  const [xAxis, setxAxis] = useState();
  const {item} = route.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [radar]);

  const loadData = () => {
    api
      .get(`radar/dashboard/${item.id_radar}`)
      .then((resp) => {
        const instantCard = resp.data[0].RadarInstantMeasureCard[0];
        setInstantCard(instantCard)
        const tideTable = resp.data[0].RadarTideTable;
        if(tideTable.length>3){
          setTideTable(tideTable)
        }
        const list = resp.data[0].RadarIntensityGraph;
        let axis = {
          valueFormatter: list.map((item) => String(item.hour)),
          drawLabels: true,
        };
        setxAxis(axis);

        const data = [
          {
            values: list.map((item) => item.sustained),
            label: 'Média',
            config: {
              color: processColor('#FFC107'),
              drawFilled: false,
              drawValues: false,
              fillColor: processColor('#FFC107'),
            },
          },
          {
            values: list.map((item) => item.gust),
            label: 'Maxima',
            config: {
              color: processColor('#27AE60'),
              drawFilled: false,
              drawValues: false,
              drawHighlightIndicators: false,
              fillColor: processColor('#27AE60'),
            },
          },
        ];
        setLastIntensity(resp.data[0].RadarIntensityLastCards[0]);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log('error', error);
      });
  };

  const legend = {
    enabled: false,
    textSize: 14,
    form: 'CIRCLE',
    wordWrapEnabled: false,
  };

  return (
    <>
    {loading && <Laoding />}
    {!loading && !instantCard && !tideTable && (
      <NotFound title="Não foi possível obter as informações desse radar" />
    )}
    {!loading && instantCard && tideTable && (
      <ScrollView style={styles.container}>
        {instantCard && (
          <ItemInfo
            title={`${instantCard.sustained} Nós`}
            gust={`${instantCard.gust} Nós (Rajada)`}
            cardealDegrees={`${instantCard.cardeal} ${instantCard.degrees}º`}
            wind_alignment={instantCard.wind_alignment}
            online={`${instantCard.online} LINE`}
            description={`Medição: ${format(
              parseISO(instantCard.last_measure),
              'dd/MM/yyyy HH:mm',
            )}`}
            color={instantCard.color}
          />
        )}
        <View style={styles.containerMedicoes}>
          <ItemInfo2 color='#EDEDED' tideTable={tideTable}/>
        </View>
        <View style={styles.containerMedicoes}>
          <ItemInfo1
            title={lastIntensity ? lastIntensity.sustained : 0}
            description="Média"
            color="#8ED000"
          />
          <ItemInfo1
            title={lastIntensity ? lastIntensity.gust : 0}
            description="Rajada"
            color="#D00000"
          />
          <ItemInfo1
            title={lastIntensity ? lastIntensity.cardeal : 0}
            degrees={`${instantCard.degrees}º`}
            description="Direção"
            color="#B4B0B0"
          />
        </View>
        <View style={{paddingHorizontal:10}}>
          <View style={{backgroundColor:colors.white, borderRadius:5, marginTop:10}}>
            <Text style={[styles.titleLegenda]}>Última Hora</Text>
          </View>
          <View style={{backgroundColor:colors.white, borderRadius:5, marginTop:10}}>
            <Text style={styles.titleLegenda}>Direção Predominante</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <ItemLengenda title={"Orientação\n da Costa"} color="#D00000" />
              <ItemLengenda title={"Exposição\n da Costa"} color="#8ED000" />
              <ItemLengenda title={"Direção\n Predominante"} color="#0500FF" />
            </View>
          </View>
        </View>
        {data && xAxis && (
          <View style={{alignItems:'center', justifyContent:'center'}}>
            <View
              style={{
                height: (width * 85) / 100,
                width: (width * 85) / 100,
                marginVertical: (height * 3) / 100,
                backgroundColor: 'white',
                borderRadius: (width * 85) / 100,
                padding: (width * 5) / 100,
              }}>
              <RadarChart
                style={styles.chart}
                data={{dataSets: data}}
                xAxis={xAxis}
                yAxis={{
                  drawLabels: true,
                }}
                chartDescription={{text: ''}}
                legend={legend}
                drawWeb={false}
                webLineWidth={0.2}
                webLineWidthInner={0.2}
                webAlpha={255}
                webColor={processColor('red')}
                webColorInner={processColor('#d1d1d1')}
                skipWebLineCount={1}
              />
            </View>
          </View>
        )}
      </ScrollView>
    )}
    </>
  );
};

const ItemLengenda = ({color, title}) => (
  <View style={{justifyContent:'space-between', flexDirection:'row', alignItems:'flex-start'}}>
    <View
      style={{
        marginTop:5,
        backgroundColor: color,
        width: 20,
        height: (height * 1.2) / 100,
        borderRadius: 5,
      }}
    />
    <Text> {title}</Text>
  </View>
);

const ItemInfo = ({title, gust, cardealDegrees, wind_alignment, online, color = 'black', description }) => (
  <View style={[styles.containerItem2, {backgroundColor: color}]}>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.textItemTitle}>{title}</Text>
      <Text style={[styles.textItemTitle, {fontSize: 14}]}>{gust}</Text>
      <Text style={[styles.textItemTitle, {fontSize: 18, marginTop:10}]}>{cardealDegrees}</Text>
      <Text style={[styles.textItemTitle, {fontSize: 12}]}>{wind_alignment}</Text>
      <Text style={[styles.textItemTitle, {fontSize: 12}]}>{online}</Text>
    </View>
    <View style={styles.containerDescricao}>
      <Text style={styles.textDescription}>{description}</Text>
    </View>
  </View>
);

const ItemInfo1 = ({title = 0, color = 'black', degrees='Nós', description}) => (
  <View style={[styles.containerItem, {backgroundColor: color}]}>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.textItemTitle}>{title}</Text>
      <Text style={[styles.textItemTitle, {fontSize: 22}]}>{degrees}</Text>
    </View>

    <View style={styles.containerDescricao}>
      <Text style={styles.textDescription}>{description}</Text>
    </View>
  </View>
);

const ItemInfo2 = ({color='#fff', tideTable}) => (
  <View style={[styles.containerItem, {backgroundColor: color}]}>
    <View style={{flex: 1, alignItems: 'center', flexDirection:'row', justifyContent:'space-between', width:'85%'}}>
      <View style={{alignItems:'center'}}>
        <Image source={require('../../assets/imgs/lua1.png')}/>
        <Image style={{marginTop:5}} source={require('../../assets/imgs/mare1.png')}/>
      </View>
      <View style={{alignItems:'center'}}>
        <Text style={{fontSize:14}}>  {tideTable[0].hour}</Text>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Entypo name="triangle-up" size={26} color="#EE1717" />
          <Text style={{fontSize:14}}>{tideTable[0].tide}</Text>
        </View>
      </View>
      <View style={{alignItems:'center'}}>
        <Text style={{fontSize:14}}>  {tideTable[1].hour}</Text>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Entypo name="triangle-down" size={26} color="#0062FF" />
          <Text style={{fontSize:14}}>{tideTable[1].tide}</Text>
        </View>
      </View>
      <View style={{alignItems:'center'}}>
        <Text style={{fontSize:14}}>  {tideTable[2].hour}</Text>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Entypo name="triangle-up" size={26} color="#EE1717" />
          <Text style={{fontSize:14}}>{tideTable[2].tide}</Text>
        </View>
      </View>
      <View style={{alignItems:'center'}}>
        <Text style={{fontSize:14}}>  {tideTable[3].hour}</Text>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Entypo name="triangle-down" size={26} color="#0062FF" />
          <Text style={{fontSize:14}}>{tideTable[3].tide}</Text>
        </View>
      </View>
    </View>
    
    <View style={styles.containerDescricao}>
      <Text style={styles.textDescription}></Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  chart: {
    flex: 1,
  },
  titleLegenda: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    marginVertical: (height * 1) / 100,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingVertical: (height * 2) / 100,
  },
  containerItem: {
    maxHeight: (15 * height) / 100,
    minHeight: (15 * height) / 100,
    flex: 1,
    borderRadius: 5,
    marginHorizontal: (2 * width) / 100,
    alignItems: 'center',
    overflow:'hidden'
  },
  containerItem2: {
    maxHeight: (15 * height) / 70,
    minHeight: (15 * height) / 70,
    flex: 1,
    borderRadius: 5,
    marginHorizontal: (2 * width) / 100,
    alignItems: 'center',
    overflow:'hidden'
  },
  textItemTitle: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
  },
  containerDescricao: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    alignItems: 'center',
  },
  textDescription: {
    color: 'white',
    fontSize: 12,
  },
  containerMedicoes: {
    marginTop: (height * 2) / 100,
    flexDirection: 'row',
    minHeight: (15 * height) / 100,
  },
});

export default radar;
