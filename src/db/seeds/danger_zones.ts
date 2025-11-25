import { db } from '@/db';
import { dangerZones } from '@/db/schema';

async function main() {
    const sampleDangerZones = [
        {
            name: 'Downtown East Side',
            latitude: 49.2827,
            longitude: -123.1207,
            radius: 1500,
            riskLevel: 'critical',
            crimeRate: 87.5,
            description: 'High crime area with frequent reports of theft, assault, and drug-related incidents. Avoid walking alone especially after 8 PM. Multiple police incidents reported weekly.',
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Industrial District',
            latitude: 49.2734,
            longitude: -123.0567,
            radius: 2000,
            riskLevel: 'high',
            riskLevel: 'high',
            crimeRate: 68.3,
            description: 'Poorly lit area with abandoned warehouses. Unsafe at night due to limited foot traffic and inadequate lighting. Vehicle break-ins are common.',
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Market Square',
            latitude: 49.2845,
            longitude: -123.1089,
            radius: 800,
            riskLevel: 'medium',
            crimeRate: 42.7,
            description: 'Busy marketplace with pickpocketing incidents. Keep valuables secure. Be cautious during evening hours when crowds thin out.',
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Bus Terminal Area',
            latitude: 49.2801,
            longitude: -123.1145,
            radius: 1000,
            riskLevel: 'medium',
            crimeRate: 51.2,
            description: 'Transit hub with occasional petty theft and harassment reports. Stay alert in waiting areas and avoid isolated platforms after dark.',
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Park Area After Dark',
            latitude: 49.2914,
            longitude: -123.1289,
            radius: 500,
            riskLevel: 'low',
            crimeRate: 18.5,
            description: 'Generally safe but poorly monitored after sunset. Minor incidents of public intoxication reported. Use well-lit pathways when visiting after 10 PM.',
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(dangerZones).values(sampleDangerZones);
    
    console.log('✅ Danger zones seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});