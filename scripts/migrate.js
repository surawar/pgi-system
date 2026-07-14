const { Client } = require("pg");

const localDb = new Client({
  host: "localhost",
  port: 5432,
  database: "pgi",
  user: "postgres",
  password: "4567",
});

const cloudDb = new Client({
  host: "db.ijeuvzyfdxdthlmazcmq.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "Krishna456Surawar",
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrate() {
  try {
    console.log("Connecting to local database...");
    await localDb.connect();

    console.log("Connecting to Supabase...");
    await cloudDb.connect();

    console.log("Reading local beneficiaries...");
    const result = await localDb.query(
      "SELECT * FROM beneficiaries ORDER BY id"
    );

    console.log(`Found ${result.rows.length} records`);

    console.log("Creating table in Supabase if it doesn't exist...");

    await cloudDb.query(`
      CREATE TABLE IF NOT EXISTS beneficiaries (
        id BIGINT PRIMARY KEY,
        taluka TEXT,
        zp TEXT,
        panchayat TEXT,
        village_name TEXT,
        reg_no TEXT,
        beneficiary TEXT,
        year TEXT,
        scheme_code TEXT,
        house_status TEXT,
        inspection_date TEXT,
        amount_released NUMERIC,
        installment NUMERIC,
        credit_date TEXT
      );
    `);

    console.log("Uploading data...");

    for (const row of result.rows) {
      await cloudDb.query(
        `
        INSERT INTO beneficiaries
        (
          id,
          taluka,
          zp,
          panchayat,
          village_name,
          reg_no,
          beneficiary,
          year,
          scheme_code,
          house_status,
          inspection_date,
          amount_released,
          installment,
          credit_date
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
        )
        ON CONFLICT (id)
        DO NOTHING;
        `,
        [
          row.id,
          row.taluka,
          row.zp,
          row.panchayat,
          row.village_name,
          row.reg_no,
          row.beneficiary,
          row.year,
          row.scheme_code,
          row.house_status,
          row.inspection_date,
          row.amount_released,
          row.installment,
          row.credit_date,
        ]
      );
    }

    console.log("✅ Migration completed successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await localDb.end();
    await cloudDb.end();
  }
}

migrate();