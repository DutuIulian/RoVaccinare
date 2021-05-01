import React, { useReducer, useEffect } from 'react';
import './styles.scss';

function Home() {
	return (
		<table class="news">
			<tr>
				<td>Actualizare zilnică (01/05) – evidența persoanelor vaccinate împotriva COVID-19</td>
			</tr>
			<tr>
				<td>
					May 1, 2021
				</td>
			</tr>
			<tr>
				<td>Potrivit datelor puse la dispoziția Comitetului Național de Coordonare a Activităților privind Vaccinarea împotriva COVID-19 (CNCAV) de către Institutul Național de Sănătate Publică (INSP-CNSCBT), prin aplicația Registrul Electronic Național al Vaccinărilor (RENV), care ține evidența vaccinărilor, situația din ziua de 1 mai a.c., ora 17.00, este următoarea:</td>
			</tr>
		</table>
	);
}

export default Home;