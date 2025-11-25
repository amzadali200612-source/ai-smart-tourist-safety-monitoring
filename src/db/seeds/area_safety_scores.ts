import { db } from '@/db';
import { areaSafetyScores } from '@/db/schema';

async function main() {
    const sampleAreaSafetyScores = [
        {
            areaName: 'Downtown Business District',
            latitude: 40.7589,
            longitude: -73.9851,
            safetyScore: 85,
            crimeRate: 15,
            crowdDensity: 'high',
            recentIncidents: 2,
            lastUpdated: new Date().toISOString(),
        },
        {
            areaName: 'Tourist Waterfront',
            latitude: 40.7069,
            longitude: -74.0113,
            safetyScore: 90,
            crimeRate: 10,
            crowdDensity: 'high',
            recentIncidents: 1,
            lastUpdated: new Date().toISOString(),
        },
        {
            areaName: 'Shopping District',
            latitude: 40.7614,
            longitude: -73.9776,
            safetyScore: 82,
            crimeRate: 18,
            crowdDensity: 'high',
            recentIncidents: 2,
            lastUpdated: new Date().toISOString(),
        },
        {
            areaName: 'Historic Old Town',
            latitude: 40.7080,
            longitude: -74.0133,
            safetyScore: 75,
            crimeRate: 25,
            crowdDensity: 'medium',
            recentIncidents: 3,
            lastUpdated: new Date().toISOString(),
        },
        {
            areaName: 'University Campus Area',
            latitude: 40.8075,
            longitude: -73.9626,
            safetyScore: 70,
            crimeRate: 30,
            crowdDensity: 'medium',
            recentIncidents: 4,
            lastUpdated: new Date().toISOString(),
        },
        {
            areaName: 'Entertainment District',
            latitude: 40.7580,
            longitude: -73.9855,
            safetyScore: 65,
            crimeRate: 35,
            crowdDensity: 'high',
            recentIncidents: 5,
            lastUpdated: new Date().toISOString(),
        },
        {
            areaName: 'Market Street Area',
            latitude: 40.7145,
            longitude: -73.9425,
            safetyScore: 55,
            crimeRate: 45,
            crowdDensity: 'medium',
            recentIncidents: 8,
            lastUpdated: new Date().toISOString(),
        },
        {
            areaName: 'Industrial Zone',
            latitude: 40.7282,
            longitude: -74.0776,
            safetyScore: 40,
            crimeRate: 60,
            crowdDensity: 'low',
            recentIncidents: 12,
            lastUpdated: new Date().toISOString(),
        },
        {
            areaName: 'East Side Neighborhood',
            latitude: 40.7614,
            longitude: -73.9509,
            safetyScore: 35,
            crimeRate: 65,
            crowdDensity: 'low',
            recentIncidents: 15,
            lastUpdated: new Date().toISOString(),
        },
        {
            areaName: 'Park Area at Night',
            latitude: 40.7829,
            longitude: -73.9654,
            safetyScore: 50,
            crimeRate: 50,
            crowdDensity: 'low',
            recentIncidents: 7,
            lastUpdated: new Date().toISOString(),
        }
    ];

    await db.insert(areaSafetyScores).values(sampleAreaSafetyScores);
    
    console.log('✅ Area safety scores seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});